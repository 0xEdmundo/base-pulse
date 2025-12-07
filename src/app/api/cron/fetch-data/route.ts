import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchTickerData } from '@/lib/dexscreener';
import { fetchUserCasts, extractImageFromCast, getCastUrl } from '@/lib/neynar';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for this endpoint

// Verify cron secret for Vercel Cron
function verifyCronSecret(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;

    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) return true; // Skip auth in development

    return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
    // Verify authorization
    if (!verifyCronSecret(request)) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const results = {
        ticker: { success: false, message: '' },
        casts: { success: false, count: 0, message: '' },
    };

    try {
        // 1. Update ticker data
        console.log('📊 Fetching ticker data...');
        const tickerData = await fetchTickerData();
        const jsonData = JSON.parse(JSON.stringify(tickerData));
        await prisma.tickerCache.upsert({
            where: { id: 'ticker' },
            update: { data: jsonData },
            create: { id: 'ticker', data: jsonData },
        });
        results.ticker = { success: true, message: 'Ticker updated' };
        console.log('✅ Ticker data updated');

        // 2. Fetch Farcaster casts for all projects with FIDs
        console.log('📢 Fetching Farcaster casts...');
        const projects = await prisma.project.findMany({
            where: {
                farcasterFid: { not: null },
            },
        });

        let newCastsCount = 0;
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);

        for (const project of projects) {
            if (!project.farcasterFid) continue;

            try {
                const casts = await fetchUserCasts(project.farcasterFid, 5);

                for (const cast of casts) {
                    const castDate = new Date(cast.timestamp);

                    // Only process casts from the last hour
                    if (castDate < oneHourAgo) continue;

                    // Check if cast already exists
                    const existing = await prisma.newsFeed.findFirst({
                        where: {
                            originalLink: getCastUrl(cast.hash, cast.author.username),
                        },
                    });

                    if (!existing) {
                        const expiresAt = new Date();
                        expiresAt.setHours(expiresAt.getHours() + 48);

                        await prisma.newsFeed.create({
                            data: {
                                sourceProjectId: project.id,
                                title: cast.text.slice(0, 200) + (cast.text.length > 200 ? '...' : ''),
                                content: cast.text,
                                imageUrl: extractImageFromCast(cast),
                                originalLink: getCastUrl(cast.hash, cast.author.username),
                                sourceType: 'FARCASTER',
                                expiresAt,
                            },
                        });
                        newCastsCount++;
                    }
                }
            } catch (error) {
                console.error(`Error fetching casts for ${project.name}:`, error);
            }
        }

        results.casts = { success: true, count: newCastsCount, message: `Added ${newCastsCount} new casts` };
        console.log(`✅ Added ${newCastsCount} new casts`);

        return NextResponse.json({
            success: true,
            results,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Cron job error:', error);
        return NextResponse.json(
            { success: false, error: 'Cron job failed', results },
            { status: 500 }
        );
    }
}
