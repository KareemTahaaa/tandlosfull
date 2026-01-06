import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();

        // Update Price
        if (typeof body.price === 'number') {
            await prisma.product.update({
                where: { id: params.id },
                data: { price: body.price }
            });
        }

        // Update Stock (Array of updates)
        if (Array.isArray(body.stocks)) {
            for (const stockUpdate of body.stocks) {
                // If ID exists, update it. If not, create (though usually we update existing)
                if (stockUpdate.id) {
                    await prisma.productStock.update({
                        where: { id: stockUpdate.id },
                        data: { quantity: Number(stockUpdate.quantity) }
                    });
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update error', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
