import { NextResponse } from 'next/server';

const API_KEY = process.env.SHIPBLU_API_KEY;
const BASE_URL = process.env.SHIPBLU_BASE_URL || 'https://api.shipblu.com/api/v1';

export async function POST(request: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: 'ShipBlu API Key not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { governorateId, cashAmount, weight = 1000 } = body;

        if (!governorateId) {
            return NextResponse.json({ error: 'Governorate ID is required' }, { status: 400 });
        }

        const res = await fetch(`${BASE_URL}/pricing/orders/delivery/`, {
            method: 'POST',
            headers: {
                'Authorization': `Api-Key ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                to_governorate: parseInt(governorateId),
                cash_amount: cashAmount,
                packages: [weight],
                declared_value: cashAmount,
                is_customer_allowed_to_open_packages: true
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('ShipBlu Pricing Error:', data);
            return NextResponse.json({ error: data.detail || 'Failed to calculate shipping' }, { status: res.status });
        }

        // Return the total rounded to integer as per user request
        return NextResponse.json({
            shippingFee: Math.round(data.total || 0),
            details: data
        });

    } catch (error: any) {
        console.error('Shipping Calculation Error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
