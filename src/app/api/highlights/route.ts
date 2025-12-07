import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// Get highlights (Official category only) for the slider
export async function GET(request: NextRequest) {
    try {
        const highlights = await prisma.newsFeed.findMany({
            where: {
                project: {
                    category: 'OFFICIAL',
                },
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                project: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
        });

        return NextResponse.json({
            success: true,
            data: highlights,
        });
    } catch (error) {
        console.error('Error fetching highlights:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch highlights' },
            { status: 500 }
        );
    }
}
