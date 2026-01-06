'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(console.error);
    }, []);

    if (!stats) return <div>Loading Admin Dashboard...</div>;

    const cards = [
        { label: 'Total Revenue', value: `${stats.revenue.toLocaleString()} EGP`, color: '#4CAF50' },
        { label: 'Total Orders', value: stats.orders, color: '#2196F3' },
        { label: 'Products', value: stats.products, color: '#9C27B0' },
        { label: 'Low Stock Items', value: stats.lowStock, color: '#F44336' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Dashboard Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {cards.map((card) => (
                    <div key={card.label} style={{
                        backgroundColor: '#fff',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        borderLeft: `5px solid ${card.color}`
                    }}>
                        <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{card.label}</h3>
                        <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
