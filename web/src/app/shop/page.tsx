"use client";

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './ShopPage.module.css';

interface Product {
    id: string;
    title: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    images: string[];
    stock: number;
    groupId?: string;
    color?: string;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('API Error:', errorText);
                    throw new Error('Failed to fetch products');
                }
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('Products data is not an array:', data);
                }
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

    // Filter products to show unique groups (preferring Black)
    const uniqueProducts = products.reduce((acc, product) => {
        // If no group, just add it
        if (!product.groupId) {
            acc.push(product);
            return acc;
        }

        // Check if we already have this group
        const existingIndex = acc.findIndex(p => p.groupId === product.groupId);
        if (existingIndex === -1) {
            // New group, add it
            acc.push(product);
        } else {
            // Group exists. Replace if current is "Black" and existing is not.
            // (Assuming we want to show Black as the default card)
            if (product.color === 'Black' && acc[existingIndex].color !== 'Black') {
                acc[existingIndex] = product;
            }
        }
        return acc;
    }, [] as Product[]).sort((a, b) => a.price - b.price);

    return (
        <div className={`container ${styles.page}`}>
            <ProductGrid>
                {uniqueProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={product.image}
                        images={product.images}
                    />
                ))}
            </ProductGrid>
        </div>
    );
}
