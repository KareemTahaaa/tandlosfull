import { NextResponse } from 'next/server';
import { ShipBluService } from '@/lib/shipblu';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');

    if (!cityId) {
        return NextResponse.json({ error: 'cityId is required' }, { status: 400 });
    }

    try {
        const data = await ShipBluService.getZones(parseInt(cityId));
        return NextResponse.json(data);
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
