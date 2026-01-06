import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const [orderCount, productCount, totalRevenueResult, lowStockCount] = await Promise.all([
            prisma.order.count(),
            prisma.product.count(),
            prisma.order.aggregate({
                _sum: { total: true }
            }),
            prisma.productStock.count({
                where: { quantity: { lt: 5 } }
            })
        ]);

        return NextResponse.json({
            orders: orderCount,
            products: productCount,
            revenue: totalRevenueResult._sum.total || 0,
            lowStock: lowStockCount
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
