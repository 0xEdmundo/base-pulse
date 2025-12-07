import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');

    try {
        const where: any = {};

        // Filter by project category
        if (category) {
            where.project = { category: category.toUpperCase() };
        }

        // Filter by project priority
        if (priority) {
            where.project = { ...where.project, priority: priority.toUpperCase() };
        }

        // Only get non-expired news
        where.expiresAt = { gt: new Date() };

        const [news, total] = await Promise.all([
            prisma.newsFeed.findMany({
                where,
                include: {
                    project: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.newsFeed.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                items: news,
                total,
                page,
                pageSize,
                hasMore: page * pageSize < total,
            },
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}
