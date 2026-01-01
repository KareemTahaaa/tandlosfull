"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './RelatedProducts.module.css';

interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
}

interface RelatedProductsProps {
    currentProductId: string;
}

export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const allProducts: Product[] = await res.json();

                    // Filter out current product and shuffle
                    const others = allProducts.filter(p => p.id !== currentProductId);
                    const shuffled = others.sort(() => 0.5 - Math.random());

                    // Take first 3
                    setProducts(shuffled.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching related products:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [currentProductId]);

    if (loading || products.length === 0) return null;

    return (
        <section className={styles.relatedSection}>
            <h2 className={styles.heading}>You May Also Like</h2>
            <div className={styles.grid}>
                {products.map(product => (
                    <Link href={`/product/${product.id}`} key={product.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.info}>
                            <h3 className={styles.title}>{product.title}</h3>
                            <p className={styles.price}>{product.price.toLocaleString()} EGP</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
