import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        const reviews = await prisma.review.findMany({
            where: {
                productId: id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Error fetching reviews' },
            { status: 500 }
        );
    }
}
