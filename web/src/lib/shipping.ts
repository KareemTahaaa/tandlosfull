
export async function createShipment(orderData: any, customerData: any) {
    console.log('Mock createShipment called with:', orderData, customerData);
    // Return a mock shipment object
    return {
        id: 'mock-shipment-id',
        status: 'created',
        trackingNumber: 'mock-tracking-123'
    };
}
