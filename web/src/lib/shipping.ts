import { ShipBluService } from './shipblu';

export async function createShipment(orderData: any, customerData: any) {
    console.log('ShipBlu createShipment called with:', orderData, customerData);

    // Map Tandlos data to ShipBlu schema
    // Reference: ShipBlu DeliveryOrder creation
    const shipbluOrder = {
        customer: {
            address: {
                line_1: customerData.address,
                line_2: "", // Optional
                zone: orderData.zoneId // We'll pass this from the frontend
            },
            phone: customerData.phone,
            full_name: `${customerData.firstName} ${customerData.lastName}`,
            email: customerData.email,
        },
        packages: orderData.items.map((item: any) => ({
            package_size: 1, // Defaulting to Small (1)
            description: `${item.title} (Size: ${item.size})`,
            fragile: false
        })),
        cash_amount: orderData.total, // Total including shipping
        merchant_order_reference: orderData.orderId.toString(),
        notes: "Tandlos Web Order"
    };

    try {
        const result = await ShipBluService.createDeliveryOrder(shipbluOrder);
        return {
            id: result.id,
            status: result.status,
            trackingNumber: result.tracking_number
        };
    } catch (error) {
        console.error("ShipBlu Integration Error:", error);
        throw error;
    }
}
