import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchTickerData } from '@/lib/dexscreener';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every minute

export async function GET() {
    try {
        // Try to get cached ticker data from database
        const cached = await prisma.tickerCache.findUnique({
            where: { id: 'ticker' },
        });

        // If cache is fresh (less than 1 minute old), return it
        if (cached) {
            const cacheAge = Date.now() - cached.updatedAt.getTime();
            if (cacheAge < 60000) {
                return NextResponse.json({
                    success: true,
                    data: cached.data,
                });
            }
        }

        // Fetch fresh data
        const tickerData = await fetchTickerData();
        // Convert to plain JSON for Prisma
        const jsonData = JSON.parse(JSON.stringify(tickerData));

        // Update cache
        await prisma.tickerCache.upsert({
            where: { id: 'ticker' },
            update: { data: jsonData },
            create: { id: 'ticker', data: jsonData },
        });

        return NextResponse.json({
            success: true,
            data: tickerData,
        });
    } catch (error) {
        console.error('Error fetching ticker data:', error);

        // Return cached data on error if available
        const cached = await prisma.tickerCache.findUnique({
            where: { id: 'ticker' },
        });

        if (cached) {
            return NextResponse.json({
                success: true,
                data: cached.data,
                cached: true,
            });
        }

        return NextResponse.json(
            { success: false, error: 'Failed to fetch ticker data' },
            { status: 500 }
        );
    }
}

