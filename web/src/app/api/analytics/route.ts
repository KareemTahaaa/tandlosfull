import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, page, details } = body;

        await prisma.analyticsEvent.create({
            data: {
                type,
                page,
                details
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
