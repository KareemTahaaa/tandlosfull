"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { trackEmailSignup } from '@/lib/analytics';

export default function WaitingList() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const targetDate = new Date('2025-12-31T23:59:00');

        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Thanks for subscribing!');
                setEmail('');

                // Track email signup in Google Analytics
                trackEmailSignup(email);
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong.');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('Failed to submit. Please try again.');
        }
    };

    return (
        <div className="waiting-list-page">
            <div className="overlay" />

            <div className="content-wrapper">


                {/* 2. Middle Section (Split Layout) */}
                <div className="middle-section">
                    {/* Left Side: Text */}
                    <div className="text-col">
                        <h2 className="next-drop">NEXT DROP</h2>
                        <p className="sub-text">WAITING FOR YOU TO JOIN THE LIST</p>
                    </div>

                    {/* Right Side: Timer */}
                    {timeLeft && (
                        <div className="timer-col">
                            <div className="timer-display">
                                {String(timeLeft.days).padStart(3, '0')}:{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                            </div>
                            <div className="timer-labels">
                                <span>DAYS</span>
                                <span>HOURS</span>
                                <span>MINUTES</span>
                                <span>SECONDS</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Bottom Section (Email Form) */}
                <div className="bottom-section">
                    <p className="form-label">ADD YOUR EMAIL FOR EARLY ACCESS</p>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading' || status === 'success'}
                                className="email-input"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className="submit-btn"
                            >
                                {status === 'loading' ? '...' : status === 'success' ? 'JOINED' : 'JOIN'}
                            </button>
                        </div>
                        {message && (
                            <p className={`message ${status === 'error' ? 'error' : 'success'}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>

                {/* Footer Credit */}
                <div className="footer-credit">
                    <p>Developed by @Kareem Taha</p>
                </div>
            </div>

            <style jsx>{`
                .waiting-list-page {
                    position: relative;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    color: #fff;
                    background-image: url("/background-v2.jpg");
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    font-family: var(--font-outfit), sans-serif;
                }
                
                .overlay {
                    position: absolute;
                    inset: 0;
                    background-color: rgba(0,0,0,0.4);
                    z-index: 0;
                }

                .content-wrapper {
                    position: relative;
                    z-index: 1;
                    height: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 40px 20px;
                }

                /* LOGO */
                .logo-section {
                    text-align: center;
                    margin-bottom: 40px;
                    margin-top: 60px; /* Push logo down a bit */
                }
                .logo-text {
                    font-family: var(--font-family-heading); /* Oswald */
                    font-size: 3rem;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-weight: 700;
                }

                /* MIDDLE SPLIT */
                .middle-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    margin-bottom: auto; /* Push bottom section down */
                    margin-top: auto;    /* Center vertically between logo and form */
                    padding: 0 40px;
                }

                .text-col {
                    text-align: left;
                }
                .next-drop {
                    font-family: var(--font-family-heading);
                    font-size: 3.5rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    line-height: 1;
                    margin-bottom: 10px;
                    text-shadow: 0 0 20px rgba(255,255,255,0.3);
                }
                .sub-text {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    opacity: 0.8;
                    margin-left: 5px;
                }

                .timer-col {
                    text-align: right;
                }
                .timer-display {
                    font-family: monospace; /* Or a sleek mono font */
                    font-size: 2.5rem;
                    font-weight: 300;
                    letter-spacing: 0.1em;
                    margin-bottom: 5px;
                }
                .timer-labels {
                    display: flex;
                    justify-content: space-between; /* Spread labels to match numbers approx */
                    gap: 10px;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    opacity: 0.6;
                    padding-right: 5px;
                    width: 100%;
                }

                /* BOTTOM FORM */
                .bottom-section {
                    text-align: center;
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto 60px; /* Margin from bottom */
                }
                .form-label {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 20px;
                    opacity: 0.9;
                }
                .input-group {
                    display: flex;
                    align-items: center;
                    border-bottom: 2px solid rgba(255,255,255,0.8);
                    padding-bottom: 10px;
                }
                .email-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-size: 1rem;
                    padding: 5px;
                    outline: none;
                }
                .email-input::placeholder {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.9rem;
                }
                .submit-btn {
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    cursor: pointer;
                    padding: 5px 10px;
                    letter-spacing: 0.1em;
                    transition: opacity 0.2s;
                }
                .submit-btn:hover {
                    opacity: 0.7;
                }
                .submit-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .message {
                    margin-top: 15px;
                    font-size: 0.8rem;
                }
                .message.error { color: #ff6b6b; }
                .message.success { color: #51cf66; }

                /* FOOTER CREDIT */
                .footer-credit {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    text-align: center;
                    padding: 15px 0;
                    z-index: 2;
                }
                .footer-credit p {
                    font-size: 0.7rem;
                    color: rgba(255, 255, 255, 0.5);
                    letter-spacing: 0.05em;
                    margin: 0;
                }

                /* RESPONSIVE */
                @media (max-width: 768px) {
                    .middle-section {
                        flex-direction: column;
                        gap: 40px;
                        text-align: center;
                        padding: 0;
                    }
                    .text-col, .timer-col {
                        text-align: center;
                    }
                    .next-drop { font-size: 2.5rem; }
                    .timer-display { font-size: 1.8rem; }
                    .timer-labels { justify-content: center; gap: 20px; }
                }
            `}</style>
        </div>
    );
}
