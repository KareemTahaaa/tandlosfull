"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './CollectionsPage.module.css';

const COLLECTIONS = [
    {
        id: 'winter',
        title: 'Winter Collection',
        slug: 'winter',
        image: '/hero-bg.png', // Using hero bg for now as a placeholder for the collection cover
        description: 'Embrace the cold with our premium heavyweight layers.'
    }
];

export default function CollectionsPage() {
    return (
        <div className={`container section ${styles.page}`}>
            <h1 className={styles.heading}>Collections</h1>

            <div className={styles.grid}>
                {COLLECTIONS.map(collection => (
                    <Link
                        key={collection.id}
                        href={`/collections/${collection.slug}`}
                        className={styles.card}
                    >
                        <div className={styles.imageWrapper}>
                            <Image
                                src={collection.image}
                                alt={collection.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                className={styles.image}
                            />
                            <div className={styles.overlay} />
                        </div>

                        <div className={styles.content}>
                            <h2 className={styles.title}>{collection.title}</h2>
                            <p className={styles.description}>{collection.description}</p>
                            <span className={styles.linkText}>Explore Collection &rarr;</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
