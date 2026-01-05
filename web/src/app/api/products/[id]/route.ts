import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { stocks: true }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        let siblings: any[] = [];
        if (product.groupId) {
            siblings = await prisma.product.findMany({
                where: {
                    groupId: product.groupId
                },
                select: {
                    id: true,
                    color: true,
                    colorCode: true,
                    image: true
                }
            });
        }

        return NextResponse.json({ ...product, siblings });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}
