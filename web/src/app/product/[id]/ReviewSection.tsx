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

import Image from 'next/image';

interface ReviewSectionProps {
    productId: string;
    productTitle: string;
    productImage: string;
}

export default function ReviewSection({ productId, productTitle, productImage }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        // Move by 1, but check bounds for 3-item view if needed.
        // Simple cyclic implementation for now
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const handleWriteReview = () => {
        if (isLoggedIn) {
            setShowReviewModal(true);
        } else {
            setShowLoginModal(true);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userEmail.trim()) {
            // Verify purchase
            try {
                const res = await fetch('/api/reviews/verify-purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail, productId })
                });

                const data = await res.json();

                if (data.verified) {
                    setIsLoggedIn(true);
                    setShowLoginModal(false);
                    setShowReviewModal(true);
                } else {
                    alert(data.message || "You must purchase this product to leave a review.");
                }
            } catch (err) {
                console.error("Verification failed", err);
                alert("Something went wrong. Please try again.");
            }
        }
    };

    // Get visible reviews (up to 3)
    const getVisibleReviews = () => {
        if (reviews.length === 0) return [];
        const visible = [];
        for (let i = 0; i < Math.min(reviews.length, 3); i++) {
            visible.push(reviews[(currentIndex + i) % reviews.length]);
        }
        return visible;
    };

    const visibleReviews = getVisibleReviews();

    return (
        <section className={styles.reviewSection}>
            <h2 className={styles.heading}>Let customers speak for us</h2>
            <div className={styles.ratingSummary}>
                <span className={styles.fiveStars}>★★★★★</span>
                <p>from {reviews.length} reviews</p>
            </div>

            {loading ? (
                <p>Loading reviews...</p>
            ) : reviews.length > 0 ? (
                <div className={styles.carouselContainer}>
                    <button onClick={prevReview} className={styles.navBtn}>‹</button>

                    <div className={styles.cardsWrapper}>
                        {visibleReviews.map((review, idx) => (
                            <div key={review.id || idx} className={styles.reviewCard}>
                                <div className={styles.rating}>
                                    {'★'.repeat(review.rating)}
                                </div>
                                <p className={styles.comment}>{review.comment}</p>
                                <div className={styles.authorInfo}>
                                    <p className={styles.author}>{review.userName}</p>
                                    <p className={styles.date}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className={styles.productLink}>
                                    <div className={styles.productThumb}>
                                        <Image src={productImage} alt={productTitle} width={50} height={50} style={{ objectFit: 'cover' }} />
                                    </div>
                                    <span className={styles.productName}>{productTitle}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={nextReview} className={styles.navBtn}>›</button>
                </div>
            ) : (
                <p className={styles.noReviews}>No reviews yet. Be the first!</p>
            )}

            <div className={styles.actionContainer}>
                <button
                    className={styles.writeReviewBtn}
                    onClick={handleWriteReview}
                >
                    Write a Review
                </button>
            </div>

            {showLoginModal && (
                <div className={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeModalBtn} onClick={() => setShowLoginModal(false)}>×</button>
                        <h3>Sign In to Review</h3>
                        <form onSubmit={handleLogin} className={styles.loginForm}>
                            <label>Enter your Gmail</label>
                            <input
                                type="email"
                                required
                                placeholder="example@gmail.com"
                                value={userEmail}
                                onChange={e => setUserEmail(e.target.value)}
                                className={styles.emailInput}
                            />
                            <button type="submit" className={styles.submitBtn}>Continue</button>
                        </form>
                    </div>
                </div>
            )}

            {showReviewModal && (
                <div className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button
                            className={styles.closeModalBtn}
                            onClick={() => setShowReviewModal(false)}
                        >
                            ×
                        </button>
                        <ReviewForm
                            productId={productId}
                            onReviewSubmitted={() => {
                                fetchReviews();
                                setShowReviewModal(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
