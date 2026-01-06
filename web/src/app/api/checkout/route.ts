import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createShipment } from '@/lib/shipping';
import { sendTelegramNotification } from '@/lib/telegram';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { contact, shipping, items, total, zoneId } = body;

        // Start a transaction to ensure stock is updated atomically
        const order = await prisma.$transaction(async (tx) => {
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
                    items: (items as any[]).map((item: any) => ({
                        productId: item.id,
                        title: item.title,
                        price: item.price,
                        quantity: 1,
                        size: item.size
                    }))
                }
            });

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

        // 5. Send Telegram Notification (Async, don't block response)
        const message = `
📦 <b>New Order Received!</b>
<b>Order ID:</b> #${order.orderNumber}
<b>Total:</b> ${total.toLocaleString()} EGP

<b>Customer:</b> ${shipping.firstName} ${shipping.lastName}
<b>Phone:</b> ${contact.phone}
<b>City:</b> ${shipping.city}

<b>Items:</b>
${(items as any[]).map((i: any) => `- ${i.title} (${i.size})`).join('\n')}
        `.trim();

        // Fire and forget - don't await so we don't slow down the response
        sendTelegramNotification(message).catch(console.error);

        // 6. Create Shipment (Outside transaction to avoid blocking DB or rolling back on API error)
        let shipment = null;
        let shipmentError = null;

        console.log("Creating shipment with zoneId:", zoneId);
        console.log("SHIPBLU_API_KEY present:", !!process.env.SHIPBLU_API_KEY);

        try {
            shipment = await createShipment({
                orderId: order.id,
                orderNumber: order.orderNumber,
                items: items,
                total: total,
                zoneId: zoneId
            }, {
                firstName: shipping.firstName,
                lastName: shipping.lastName,
                email: contact.email,
                phone: contact.phone,
                address: shipping.address,
                city: shipping.city,
                governorate: shipping.governorate
            });
        } catch (err: unknown) {
            const error = err as Error;
            console.error("Failed to create shipment:", error);
            // NOW WE FAIL THE REQUEST so the user knows ShipBlu sync failed
            return NextResponse.json(
                { success: false, error: `Order saved but ShipBlu sync failed: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber,
            shipment,
            shipmentError
        });

    } catch (error: unknown) {
        const err = error as Error;
        console.error('Checkout error:', err);
        return NextResponse.json(
            { success: false, error: err.message || 'Checkout failed' },
            { status: 500 }
        );
    }
}
