import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// Verify cron secret for Vercel Cron
function verifyCronSecret(request: NextRequest): boolean {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;

    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) return true; // Skip auth in development

    return authHeader === `Bearer ${cronSecret}`;
}

// Garbage collector - deletes expired news (48+ hours old)
export async function GET(request: NextRequest) {
    // Verify authorization
    if (!verifyCronSecret(request)) {
        return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        console.log('🗑️ Running garbage collector...');

        const result = await prisma.newsFeed.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });

        console.log(`✅ Deleted ${result.count} expired news items`);

        return NextResponse.json({
            success: true,
            deletedCount: result.count,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Cleanup cron job error:', error);
        return NextResponse.json(
            { success: false, error: 'Cleanup failed' },
            { status: 500 }
        );
    }
}
