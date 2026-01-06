'use client';

import { useEffect, useState } from 'react';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(console.error);
    }, []);

    if (!stats || !stats.summary || !stats.revenueGraph || !stats.funnel) {
        return <div className="p-8">Loading Admin Dashboard...</div>;
    }

    const { summary, revenueGraph, funnel } = stats;

    const cards = [
        { label: 'Total Revenue', value: `${(summary.revenue || 0).toLocaleString()} EGP`, color: '#4CAF50' },
        { label: 'Total Orders', value: summary.orders || 0, color: '#2196F3' },
        { label: 'Products', value: summary.products || 0, color: '#9C27B0' },
        { label: 'Low Stock Items', value: summary.lowStock || 0, color: '#F44336' },
        { label: 'Live Visitors', value: summary.liveVisitors || 0, color: '#FF9800' },
    ];

    const funnelData = [
        { name: 'Visits', value: funnel.visits || 0 },
        { name: 'Add to Cart', value: funnel.addToCart || 0 },
        { name: 'Checkout', value: funnel.checkoutStart || 0 },
        { name: 'Purchased', value: funnel.purchases || 0 },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Dashboard Overview</h1>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>

                {/* Revenue Graph */}
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Revenue (Last 7 Days)</h2>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueGraph}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} name="Revenue (EGP)" />
                                <Area type="monotone" dataKey="orders" stroke="#2196F3" fill="#2196F3" fillOpacity={0.3} name="Orders" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Conversion Funnel</h2>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" name="Count" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Low Stock Alerts */}
            <div style={{ marginTop: '3rem', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#F44336', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    ⚠️ Low Stock Alerts
                </h2>
                {stats.lowStockItems && stats.lowStockItems.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '1rem', fontWeight: 'bold', color: '#555' }}>Product</th>
                                <th style={{ padding: '1rem', fontWeight: 'bold', color: '#555' }}>Size</th>
                                <th style={{ padding: '1rem', fontWeight: 'bold', color: '#555' }}>Remaining</th>
                                <th style={{ padding: '1rem', fontWeight: 'bold', color: '#555' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.lowStockItems.map((item: any) => (
                                <tr key={`${item.id}-${item.size}`} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img src={item.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <span>{item.title}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{item.size}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: item.quantity === 0 ? 'red' : 'orange' }}>
                                        {item.quantity}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: item.quantity === 0 ? '#ffebee' : '#fff3e0',
                                            color: item.quantity === 0 ? '#c62828' : '#e65100',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {item.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No low stock items found. Great job!</p>
                )}
            </div>
        </div>
    );
}
