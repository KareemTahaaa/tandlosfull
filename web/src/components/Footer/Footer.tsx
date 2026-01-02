'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa6';
import styles from './Footer.module.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully subscribed!');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || data.message || 'Something went wrong.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Failed to connect to the server.');
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.subscribeSection}>
                    <h3 className={styles.heading}>BE PART OF THE FAM</h3>
                    <form className={styles.form} onSubmit={handleSubscribe}>
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={status === 'loading'}
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.subscribeButton}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? '...' : 'SUBSCRIBE'}
                        </button>
                    </form>
                    {message && (
                        <p className={`${styles.statusMessage} ${styles[status]}`}>
                            {message}
                        </p>
                    )}
                </div>

                <div className={styles.links}>
                    <Link href="/shop" className={styles.link}>SHOP ALL</Link>
                    <Link href="/privacy" className={styles.link}>PRIVACY POLICY</Link>
                    <Link href="/shipping-returns" className={styles.link}>SHIPPING</Link>
                    <Link href="/returns" className={styles.link}>RETURNS</Link>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.social}>
                        <a
                            href="https://www.instagram.com/tandlos.eg?igsh=MXd3Nnd5Y2hnMThiMA=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="Instagram"
                        >
                            <FaInstagram size={18} />
                        </a>
                        <a
                            href="https://www.tiktok.com/@tandlos.eg?_t=8m4FMBavYco&_r=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="TikTok"
                        >
                            <FaTiktok size={18} />
                        </a>
                    </div>
                    <p className={styles.copyright}>
                        developed by ©Kareem Taha
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
