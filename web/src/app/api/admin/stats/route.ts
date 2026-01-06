import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        // Parallel Data Fetching
        const [
            orderCount,
            productCount,
            totalRevenueResult,
            lowStockCount,
            recentOrders,
            analyticsEvents
        ] = await Promise.all([
            prisma.order.count(),
            prisma.product.count(),
            prisma.order.aggregate({ _sum: { total: true } }),
            prisma.productStock.count({ where: { quantity: { lt: 5 } } }),
            prisma.order.findMany({
                where: { createdAt: { gte: sevenDaysAgo } },
                select: { createdAt: true, total: true }
            }),
            prisma.analyticsEvent.findMany({
                where: { createdAt: { gte: sevenDaysAgo } },
                select: { eventType: true, createdAt: true, sessionId: true }
            })
        ]);

        // Process Graph Data (Last 7 days)
        const salesDataMap = new Map();
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            salesDataMap.set(dateKey, { date: dateKey, revenue: 0, orders: 0 });
        }

        recentOrders.forEach((order: any) => {
            const dateKey = order.createdAt.toISOString().split('T')[0];
            if (salesDataMap.has(dateKey)) {
                const entry = salesDataMap.get(dateKey);
                entry.revenue += order.total;
                entry.orders += 1;
            }
        });

        // Convert Map to Array and Sort
        const revenueGraph = Array.from(salesDataMap.values()).sort((a: any, b: any) => a.date.localeCompare(b.date));

        // Process Analytics Data
        // 1. Live Visitors (Active in last 10 mins)
        const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000);
        const liveVisitors = new Set(
            analyticsEvents
                .filter((e: any) => e.createdAt >= tenMinsAgo)
                .map((e: any) => e.sessionId)
        ).size;

        // 2. Funnel (Simple count over last 7 days)
        const funnel = {
            visits: analyticsEvents.filter((e: any) => e.eventType === 'VISIT').length,
            addToCart: analyticsEvents.filter((e: any) => e.eventType === 'ADD_TO_CART').length,
            checkoutStart: analyticsEvents.filter((e: any) => e.eventType === 'CHECKOUT_START').length,
            purchases: analyticsEvents.filter((e: any) => e.eventType === 'PURCHASE').length,
        };

        // 3. Low Stock Items (Detailed)
        const lowStockItems = await prisma.productStock.findMany({
            where: { quantity: { lt: 5 } },
            include: { product: { select: { title: true, image: true } } },
            take: 10
        });

        return NextResponse.json({
            summary: {
                orders: orderCount,
                products: productCount,
                revenue: totalRevenueResult._sum.total || 0,
                lowStock: lowStockCount,
                liveVisitors
            },
            revenueGraph,
            funnel,
            lowStockItems: lowStockItems.map((item: any) => ({
                id: item.id,
                title: item.product.title,
                size: item.size,
                quantity: item.quantity,
                image: item.product.image
            }))
        });
    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
