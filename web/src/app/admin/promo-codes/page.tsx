'use client';

import { useEffect, useState } from 'react';

export default function PromoCodesPage() {
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        expiresAt: '',
        usageLimit: ''
    });

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const res = await fetch('/api/admin/promo-codes');
            const data = await res.json();
            // Ensure data is an array before setting state
            if (Array.isArray(data)) {
                setPromoCodes(data);
            } else {
                console.error('Invalid response format:', data);
                setPromoCodes([]);
            }
        } catch (error) {
            console.error('Failed to fetch promo codes:', error);
            setPromoCodes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/promo-codes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setFormData({ code: '', discountType: 'PERCENTAGE', discountValue: '', expiresAt: '', usageLimit: '' });
                setShowForm(false);
                fetchPromoCodes();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to create promo code');
            }
        } catch (error) {
            console.error('Error creating promo code:', error);
            alert('Failed to create promo code');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this promo code?')) return;

        try {
            const res = await fetch(`/api/admin/promo-codes?id=${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchPromoCodes();
            } else {
                alert('Failed to delete promo code');
            }
        } catch (error) {
            console.error('Error deleting promo code:', error);
            alert('Failed to delete promo code');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Promo Codes</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
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
                    {showForm ? 'Cancel' : '+ Create Promo Code'}
                </button>
            </div>

            {showForm && (
                <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New Promo Code</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                required
                                placeholder="e.g., SUMMER2024"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Discount Type *</label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    <option value="PERCENTAGE">Percentage (%)</option>
                                    <option value="FIXED">Fixed Amount (EGP)</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Discount Value *</label>
                                <input
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                    required
                                    placeholder={formData.discountType === 'PERCENTAGE' ? 'e.g., 10' : 'e.g., 50'}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Expiration Date (Optional)</label>
                                <input
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Usage Limit (Optional)</label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    placeholder="Leave empty for unlimited"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#2196F3',
                                color: 'white',
                                padding: '0.75rem',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Create Promo Code
                        </button>
                    </form>
                </div>
            )}

            <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {promoCodes.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No promo codes yet. Create one to get started!</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Code</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Discount</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Usage</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Expires</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promoCodes.map((promo) => {
                                const isExpired = promo.expiresAt && new Date(promo.expiresAt) < new Date();
                                const isLimitReached = promo.usageLimit && promo.usageCount >= promo.usageLimit;
                                const isActive = !isExpired && !isLimitReached;

                                return (
                                    <tr key={promo.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{promo.code}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `${promo.discountValue} EGP`}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {promo.usageCount} {promo.usageLimit ? `/ ${promo.usageLimit}` : ''}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : 'No expiry'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                backgroundColor: isActive ? '#e8f5e9' : '#ffebee',
                                                color: isActive ? '#2e7d32' : '#c62828'
                                            }}>
                                                {isActive ? 'Active' : (isExpired ? 'Expired' : 'Limit Reached')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                style={{
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
