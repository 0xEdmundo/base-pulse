import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const news = await prisma.newsFeed.findUnique({
            where: { id },
            include: {
                project: true,
            },
        });

        if (!news) {
            return NextResponse.json(
                { success: false, error: 'News not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: news,
        });
    } catch (error) {
        console.error('Error fetching news item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}
