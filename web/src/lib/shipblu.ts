/**
 * ShipBlu API Client Utility
 * Environment: Staging
 */

const BASE_URL = process.env.SHIPBLU_BASE_URL || 'https://api.shipblu.com/api/v1';
const API_KEY = process.env.SHIPBLU_API_KEY;

async function shipbluFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    if (options.method === 'POST' && options.body) {
        console.log(`ShipBlu API Request [POST] ${endpoint}:`, options.body);
    } else {
        console.log(`ShipBlu API Request [${options.method || 'GET'}] ${endpoint}`);
    }

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
        let errorMessage = `ShipBlu API error: ${res.statusText}`;
        try {
            const parsed = JSON.parse(text);
            errorMessage = `ShipBlu API Error (${res.status}): ${parsed.detail || JSON.stringify(parsed)}`;
        } catch (e) {
            errorMessage = `ShipBlu API Error (${res.status}): ${text}`;
        }
        console.error(errorMessage);
        throw new Error(errorMessage);
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

    async createDeliveryOrder(data: Record<string, unknown>) {
        return shipbluFetch('/delivery-orders/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};
