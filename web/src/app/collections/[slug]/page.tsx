"use client";

import { useParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './CollectionDetails.module.css';

// Mock Data (In real app, filter products by collection ID)
const COLLECTION_PRODUCTS = [
    { id: '1', title: 'Cascade Heavyweight Hoodie', price: 2100, image: '/p1.png', badge: 'New' },
    { id: '3', title: 'Signature Sweatpants', price: 1800, image: '/p1.png' },
    { id: '4', title: 'Utility Vest - Black', price: 2500, image: '/p1.png', badge: 'Limited' },
];

export default function CollectionDetailsPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Format slug for title (e.g., "winter" -> "WINTER COLLECTION")
    const title = `${slug} Collection`.toUpperCase();

    return (
        <div className={`container section ${styles.page}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>Explore the latest drops from our {slug} series.</p>
            </div>

            <ProductGrid>
                {COLLECTION_PRODUCTS.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        image={product.image}
                        badge={product.badge}
                    />
                ))}
            </ProductGrid>
        </div>
    );
}
