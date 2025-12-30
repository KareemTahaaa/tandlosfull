import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { createShipment } from '@/lib/shipping';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { contact, shipping, items, total } = body;

        // Start a transaction to ensure stock is updated atomically
        const order = await prisma.$transaction(async (tx) => {
            // 1. Verify Stock for all items
            // 1. Verify Stock for all items
            for (const item of items) {
                const stockEntry = await tx.productStock.findUnique({
                    where: {
                        productId_size: {
                            productId: item.id,
                            size: item.size
                        }
                    }
                });

                if (!stockEntry) {
                    throw new Error(`Product ${item.title} (Size: ${item.size}) not found or unavailable`);
                }
                if (stockEntry.quantity < 1) {
                    throw new Error(`Product ${item.title} (Size: ${item.size}) is out of stock`);
                }
            }

            // 2. Create or Update Customer
            let customer = await tx.customer.findUnique({
                where: { email: contact.email }
            });

            if (!customer) {
                customer = await tx.customer.create({
                    data: {
                        email: contact.email,
                        phone: contact.phone,
                        name: `${shipping.firstName} ${shipping.lastName}`,
                        address: `${shipping.address}, ${shipping.city}, ${shipping.governorate}`
                    }
                });
            }

            // 3. Create Order with items as JSON
            const newOrder = await tx.order.create({
                data: {
                    customerId: customer.id,
                    total: total,
                    status: 'PENDING',
                    // Save Snapshot of Shipping Info
                    shippingName: `${shipping.firstName} ${shipping.lastName}`,
                    shippingPhone: contact.phone,
                    shippingAddress: shipping.address,
                    shippingCity: shipping.city,
                    shippingGovernorate: shipping.governorate,
                    // Items as JSON array
                    items: items.map((item: any) => ({
                        productId: item.id,
                        title: item.title,
                        price: item.price,
                        quantity: 1,
                        size: item.size
                    }))
                }
            });

            // 4. Decrement Stock
            // 4. Decrement Stock
            for (const item of items) {
                await tx.productStock.update({
                    where: {
                        productId_size: {
                            productId: item.id,
                            size: item.size
                        }
                    },
                    data: { quantity: { decrement: 1 } }
                });
            }

            return newOrder;
        });

        // 5. Create Shipment (Outside transaction to avoid blocking DB or rolling back on API error)
        let shipment = null;
        try {
            shipment = await createShipment({
                orderId: order.id,
                items: items,
                total: total
            }, {
                firstName: shipping.firstName,
                lastName: shipping.lastName,
                email: contact.email,
                phone: contact.phone,
                address: shipping.address,
                city: shipping.city,
                governorate: shipping.governorate
            });
        } catch (shippingError) {
            console.error("Failed to create shipment:", shippingError);
            // We don't fail the order if shipping fails, just log it.
        }

        return NextResponse.json({ success: true, orderId: order.id, orderNumber: order.orderNumber, shipment });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Checkout failed' },
            { status: 500 }
        );
    }
}
