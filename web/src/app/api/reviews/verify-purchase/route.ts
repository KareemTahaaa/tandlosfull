import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, productId } = await request.json();

        if (!email || !productId) {
            return NextResponse.json({ error: 'Missing email or product ID' }, { status: 400 });
        }

        // Find customer by email
        const customer = await prisma.customer.findUnique({
            where: { email },
            include: {
                orders: true // We need to check orders
            }
        });

        if (!customer) {
            return NextResponse.json({ verified: false, message: 'User not found' });
        }

        // Check if any order contains the product
        // orders.items is Json, so we need to parse it or iterate
        const hasPurchased = customer.orders.some(order => {
            const items = order.items as any[]; // Type assertion for Json
            return items.some((item: any) => item.productId === productId);
        });

        if (hasPurchased) {
            return NextResponse.json({ verified: true });
        } else {
            return NextResponse.json({ verified: false, message: 'No purchase history found for this product.' });
        }

    } catch (error) {
        console.error('Error verifying purchase:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
