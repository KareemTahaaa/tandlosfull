import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
        }

        const promo = await prisma.promoCode.findUnique({
            where: {
                code: code.toUpperCase(),
                isActive: true
            },
        });

        if (!promo) {
            return NextResponse.json({ error: 'Invalid or expired promo code' }, { status: 404 });
        }

        return NextResponse.json({
            code: promo.code,
            discountType: promo.discountType,
            discountValue: promo.discountValue
        });

    } catch (error) {
        console.error('Promo validation error:', error);
        return NextResponse.json({ error: 'Failed to validate promo code' }, { status: 500 });
    }
}
