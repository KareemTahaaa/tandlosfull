"use client";

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './ShopPage.module.css';

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    stock: number;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
                const res = await fetch(`${baseUrl}/api/products`);
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('API Error:', errorText);
                    throw new Error('Failed to fetch products');
                }
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="container section">Loading products...</div>;
    }

    return (
        <div className={`container section ${styles.page}`}>
            <ProductGrid>
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        image={product.image}
                    />
                ))}
            </ProductGrid>
        </div>
    );
}
