import { NextResponse } from 'next/server';
import { ShipBluService } from '@/lib/shipblu';

export async function GET() {
    try {
        const data = await ShipBluService.getGovernorates();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
