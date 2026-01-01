"use client";

import { useState } from 'react';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
    productId: string;
    onReviewSubmitted: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [userName, setUserName] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!userName.trim() || !comment.trim()) {
            setError('Please fill in all fields');
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    userName,
                    comment,
                }),
            });

            if (!res.ok) throw new Error('Failed to submit review');

            setUserName('');
            setComment('');
            setRating(5);
            onReviewSubmitted();
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Write a Review</h3>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.field}>
                <label>Name</label>
                <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Your Name"
                    className={styles.input}
                />
            </div>

            <div className={styles.field}>
                <label>Rating</label>
                <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            type="button"
                            className={`${styles.starBtn} ${star <= rating ? styles.active : ''}`}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.field}>
                <label>Review</label>
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Tell us what you think..."
                    className={styles.textarea}
                />
            </div>

            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
