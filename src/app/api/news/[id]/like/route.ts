import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const news = await prisma.newsFeed.update({
            where: { id },
            data: {
                likes: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: { likes: news.likes },
        });
    } catch (error) {
        console.error('Error liking news:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to like news' },
            { status: 500 }
        );
    }
}
