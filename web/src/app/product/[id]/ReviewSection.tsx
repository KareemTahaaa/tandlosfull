"use client";

import { useEffect, useState } from 'react';
import ReviewForm from './ReviewForm';
import styles from './ReviewSection.module.css';

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewSectionProps {
    productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/products/${productId}/reviews`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const nextReview = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    return (
        <section className={styles.reviewSection}>
            <h2 className={styles.heading}>Customer Reviews</h2>

            {loading ? (
                <p>Loading reviews...</p>
            ) : reviews.length > 0 ? (
                <div className={styles.carousel}>
                    <button onClick={prevReview} className={styles.navBtn}>‹</button>

                    <div className={styles.reviewCard}>
                        <div className={styles.rating}>
                            {'★'.repeat(reviews[currentIndex].rating)}
                            <span className={styles.emptyStars}>
                                {'★'.repeat(5 - reviews[currentIndex].rating)}
                            </span>
                        </div>
                        <p className={styles.comment}>"{reviews[currentIndex].comment}"</p>
                        <p className={styles.author}>— {reviews[currentIndex].userName}</p>
                        <p className={styles.date}>
                            {new Date(reviews[currentIndex].createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <button onClick={nextReview} className={styles.navBtn}>›</button>
                </div>
            ) : (
                <p className={styles.noReviews}>No reviews yet. Be the first!</p>
            )}

            <ReviewForm productId={productId} onReviewSubmitted={fetchReviews} />
        </section>
    );
}
