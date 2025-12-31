"use client";

import { useState, useRef } from 'react';
import styles from './VirtualTryOn.module.css';

interface VirtualTryOnProps {
    productImage: string;
    productTitle: string;
    availableSizes: string[];
    onClose: () => void;
}

export default function VirtualTryOn({ productTitle, onClose }: Omit<VirtualTryOnProps, 'productImage' | 'availableSizes'>) {
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [showDemo, setShowDemo] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // handlePhotoUpload and other state preserved if needed for future, but removing to pass lint

    const handleDemoClick = () => {
        setShowDemo(true);
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // In production, send this to your email service
            console.log('User interested in virtual try-on:', email);
            setEmailSubmitted(true);
        }
    };

    const resetTryOn = () => {
        setUserPhoto(null);
        setShowDemo(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.tryOnContainer}>
                <div className={styles.header}>
                    <h2>{productTitle}</h2>
                    <button onClick={onClose} className={styles.closeButton}>✕</button>
                </div>

                {!showDemo ? (
                    <div className={styles.uploadSection}>
                        <div className={styles.comingSoonBadge}>
                            <span className={styles.badgeIcon}>🚀</span>
                            <h3>AI Virtual Try-On</h3>
                            <p className={styles.badgeSubtitle}>Coming Soon!</p>
                        </div>

                        <div className={styles.instructions}>
                            <h3>📸 See Yourself in Our Clothes</h3>
                            <p>We&apos;re launching an amazing AI-powered virtual try-on feature that will let you:</p>
                            <ul>
                                <li>Upload your photo and see how our clothes look on you</li>
                                <li>Try different sizes instantly</li>
                                <li>Get a realistic preview before buying</li>
                                <li>Share your virtual try-on with friends</li>
                            </ul>
                        </div>

                        <div className={styles.demoSection}>
                            <h4>Want to see how it works?</h4>
                            <button onClick={handleDemoClick} className={styles.demoBtn}>
                                ✨ View Demo Preview
                            </button>
                        </div>

                        {!emailSubmitted ? (
                            <div className={styles.notifySection}>
                                <h4>Be the first to know when it launches!</h4>
                                <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={styles.emailInput}
                                        required
                                    />
                                    <button type="submit" className={styles.notifyBtn}>
                                        Notify Me
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className={styles.successMessage}>
                                <span className={styles.checkIcon}>✓</span>
                                <p>Thanks! We&apos;ll notify you when virtual try-on launches.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.demoPreview}>
                        <div className={styles.demoHeader}>
                            <h3>Demo Preview</h3>
                            <span className={styles.demoBadge}>Sample</span>
                        </div>

                        <div className={styles.comparison}>
                            <div className={styles.comparisonItem}>
                                <h4>Your Photo</h4>
                                <div className={styles.placeholderImage}>
                                    <span className={styles.placeholderIcon}>👤</span>
                                    <p>Upload your photo</p>
                                </div>
                            </div>
                            <div className={styles.comparisonItem}>
                                <h4>AI Try-On Result</h4>
                                <div className={styles.placeholderImage}>
                                    <span className={styles.placeholderIcon}>✨</span>
                                    <p>See yourself wearing {productTitle}</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.demoFeatures}>
                            <h4>Features you&apos;ll get:</h4>
                            <div className={styles.featureGrid}>
                                <div className={styles.feature}>
                                    <span>🎯</span>
                                    <p>Realistic fit</p>
                                </div>
                                <div className={styles.feature}>
                                    <span>📏</span>
                                    <p>Size comparison</p>
                                </div>
                                <div className={styles.feature}>
                                    <span>💾</span>
                                    <p>Download results</p>
                                </div>
                                <div className={styles.feature}>
                                    <span>📱</span>
                                    <p>Share on social</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.resultControls}>
                            <button onClick={resetTryOn} className={styles.backBtn}>
                                ← Back
                            </button>
                            {!emailSubmitted && (
                                <button onClick={() => setShowDemo(false)} className={styles.notifyMeBtn}>
                                    Notify Me When Ready
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
