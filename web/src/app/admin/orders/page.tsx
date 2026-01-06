'use client';

import { useEffect, useState } from 'react';

type Order = {
    id: string;
    orderNumber: number;
    shippingName: string;
    total: number;
    status: string;
    createdAt: string;
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        const res = await fetch(`/api/admin/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.ok) fetchOrders();
    };

    if (loading) return <div>Loading Orders...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Orders Manager</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
                <thead style={{ backgroundColor: '#eee' }}>
                    <tr>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>#</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Total (EGP)</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '1rem' }}>{order.orderNumber}</td>
                            <td style={{ padding: '1rem' }}>{order.shippingName}</td>
                            <td style={{ padding: '1rem' }}>{order.total.toLocaleString()}</td>
                            <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor: order.status === 'PENDING' ? '#FFC107' : order.status === 'COMPLETED' ? '#4CAF50' : '#ddd',
                                    color: '#fff',
                                    fontSize: '0.8rem'
                                }}>
                                    {order.status}
                                </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <select
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                    style={{ padding: '0.25rem' }}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="PROCESSING">PROCESSING</option>
                                    <option value="SHIPPED">SHIPPED</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
