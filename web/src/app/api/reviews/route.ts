import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, rating, comment, userName } = body;

        if (!productId || !rating || !userName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const review = await prisma.review.create({
            data: {
                productId,
                rating: Number(rating),
                comment: comment || '',
                userName,
            },
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json(
            { error: 'Error creating review' },
            { status: 500 }
        );
    }
}
