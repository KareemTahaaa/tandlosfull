/**
 * ShipBlu API Client Utility
 * Environment: Staging
 */

const BASE_URL = process.env.SHIPBLU_BASE_URL || 'https://api.staging.shipblu.com/api/v1';
const API_KEY = process.env.SHIPBLU_API_KEY;

async function shipbluFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Api-Key ${API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        console.error(`ShipBlu API Error (${res.status}):`, text);
        throw new Error(`ShipBlu API error: ${res.statusText}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

export const ShipBluService = {
    async getGovernorates() {
        return shipbluFetch('/governorates/');
    },

    async getCities(governorateId: number) {
        return shipbluFetch(`/governorates/${governorateId}/cities/`);
    },

    async getZones(cityId: number) {
        return shipbluFetch(`/cities/${cityId}/zones/`);
    },

    async createDeliveryOrder(data: any) {
        return shipbluFetch('/delivery-orders/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};
