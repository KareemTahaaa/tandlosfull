import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all promo codes
export async function GET() {
    try {
        const promoCodes = await prisma.promoCode.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(promoCodes);
    } catch (error) {
        console.error("Promo Codes API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 });
    }
}

// POST create new promo code
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, discountType, discountValue, expiresAt, usageLimit } = body;

        // Validation
        if (!code || !discountType || !discountValue) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const promoCode = await prisma.promoCode.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                discountValue: parseFloat(discountValue),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                usageCount: 0
            }
        });

        return NextResponse.json(promoCode);
    } catch (error: any) {
        console.error("Create Promo Code Error:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Promo code already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 });
    }
}

// DELETE promo code
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing promo code ID' }, { status: 400 });
        }

        await prisma.promoCode.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Promo Code Error:", error);
        return NextResponse.json({ error: 'Failed to delete promo code' }, { status: 500 });
    }
}
