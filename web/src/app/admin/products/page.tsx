'use client';

import { useEffect, useState } from 'react';

type ProductStock = {
    id: string;
    size: string;
    quantity: number;
};

type Product = {
    id: string;
    title: string;
    color?: string;
    price: number;
    stocks: ProductStock[];
};

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handlePriceChange = (id: string, newPrice: string) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, price: Number(newPrice) } : p
        ));
    };

    const handleStockChange = (productId: string, stockId: string, newQty: string) => {
        setProducts(prev => prev.map(p => {
            if (p.id !== productId) return p;
            return {
                ...p,
                stocks: p.stocks.map(s => s.id === stockId ? { ...s, quantity: Number(newQty) } : s)
            };
        }));
    };

    const saveChanges = async (product: Product) => {
        try {
            const res = await fetch(`/api/admin/products/${product.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price: product.price,
                    stocks: product.stocks.map(s => ({ id: s.id, quantity: s.quantity }))
                })
            });
            if (res.ok) {
                alert('Saved!');
                fetchProducts();
            } else {
                alert('Failed to save');
            }
        } catch (e) {
            alert('Error saving');
        }
    };

    if (loading) return <div>Loading Products...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Product Manager</h1>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {products.map(product => (
                    <div key={product.id} style={{
                        backgroundColor: '#fff',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>{product.title} {product.color && `(${product.color})`}</h3>
                            <button
                                onClick={() => saveChanges(product)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#2196F3',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Save Changes
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontSize: '0.8rem', color: '#666' }}>Price (EGP)</label>
                                <input
                                    type="number"
                                    value={product.price}
                                    onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {product.stocks.map(stock => (
                                    <div key={stock.id} style={{ display: 'flex', flexDirection: 'column', width: '60px' }}>
                                        <label style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>{stock.size}</label>
                                        <input
                                            type="number"
                                            value={stock.quantity}
                                            onChange={(e) => handleStockChange(product.id, stock.id, e.target.value)}
                                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
