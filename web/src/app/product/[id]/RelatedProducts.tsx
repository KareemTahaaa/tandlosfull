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
    groupId?: string;
}

interface RelatedProductsProps {
    currentProductId: string;
}

export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [groupIdMap, setGroupIdMap] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch('/api/products');
                if (res.ok) {
                    const allProducts: Product[] = await res.json();

                    // Create a map of groupId -> first product ID in that group
                    const groupMap = new Map<string, string>();
                    allProducts.forEach(p => {
                        if (p.groupId && !groupMap.has(p.groupId)) {
                            groupMap.set(p.groupId, p.id);
                        }
                    });
                    setGroupIdMap(groupMap);

                    // Filter out current product and verify duplicates via groupId
                    const uniqueGroups = new Set<string>();
                    const others = allProducts.filter(p => {
                        if (p.id === currentProductId) return false;

                        // If it has a groupId, only allow one per group
                        if (p.groupId) {
                            if (uniqueGroups.has(p.groupId)) return false;
                            uniqueGroups.add(p.groupId);
                            return true;
                        }

                        return true;
                    });

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
                {products.map(product => {
                    // Get the first product ID for this group, or use product.id if no group
                    const linkId = product.groupId
                        ? (groupIdMap.get(product.groupId) || product.id)
                        : product.id;

                    return (
                        <Link href={`/product/${linkId}`} key={product.id} className={styles.card}>
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
                    );
                })}
            </div>
        </section>
    );
}
