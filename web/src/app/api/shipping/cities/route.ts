import { NextResponse } from 'next/server';
import { ShipBluService } from '@/lib/shipblu';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const governorateId = searchParams.get('governorateId');

    if (!governorateId) {
        return NextResponse.json({ error: 'governorateId is required' }, { status: 400 });
    }

    try {
        const data = await ShipBluService.getCities(parseInt(governorateId));
        return NextResponse.json(data);
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
