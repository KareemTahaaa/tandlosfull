import { ShipBluService } from './shipblu';

interface OrderData {
    orderId: string;
    orderNumber: number;
    items: any[];
    total: number;
    zoneId: number;
}

interface CustomerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    governorate: string;
}

export async function createShipment(orderData: OrderData, customerData: CustomerData) {
    console.log('ShipBlu createShipment called with:', orderData, customerData);

    // Map Tandlos data to ShipBlu schema
    const shipbluOrder = {
        customer: {
            address: {
                line_1: customerData.address,
                line_2: "", // Optional
                zone: orderData.zoneId
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
        merchant_order_reference: orderData.orderNumber.toString(), // Convert number to string for ShipBlu
        notes: "Tandlos Web Order"
    };

    if (!orderData.zoneId || isNaN(orderData.zoneId)) {
        throw new Error("Invalid or missing shipping Zone ID. Please select a valid zone.");
    }

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
