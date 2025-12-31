import { NextResponse } from 'next/server';
import { ShipBluService } from '@/lib/shipblu';

export async function GET() {
    try {
        const data = await ShipBluService.getGovernorates();
        return NextResponse.json(data);
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
