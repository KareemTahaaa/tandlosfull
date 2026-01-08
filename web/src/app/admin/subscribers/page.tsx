'use client';

import { useEffect, useState } from 'react';

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/admin/subscribers');
            const data = await res.json();
            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setSubscribers(data);
            } else {
                console.error('Invalid response format:', data);
                setSubscribers([]);
            }
        } catch (error) {
            console.error('Failed to fetch subscribers:', error);
            setSubscribers([]);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const csvContent = [
            ['Email', 'Subscribed Date'].join(','),
            ...subscribers.map(sub => [
                sub.email,
                new Date(sub.createdAt).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Subscribers</h1>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>Total: {subscribers.length} subscribers</p>
                </div>
                {subscribers.length > 0 && (
                    <button
                        onClick={exportToCSV}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        📥 Export to CSV
                    </button>
                )}
            </div>

            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {subscribers.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No subscribers yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>#</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Subscribed Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscribers.map((subscriber, index) => (
                                <tr key={subscriber.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem', color: '#666' }}>{index + 1}</td>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{subscriber.email}</td>
                                    <td style={{ padding: '1rem', color: '#666' }}>
                                        {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
