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

    return (
        <div className={`container ${styles.page}`}>
            <ProductGrid>
                {products.map(product => (
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
