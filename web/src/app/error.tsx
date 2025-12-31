'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Client-side error:', error);
    }, [error]);

    return (
        <div className="container section" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            gap: '20px'
        }}>
            <h2 style={{ fontSize: '2rem', color: '#ff4d4d' }}>Something went wrong!</h2>
            <p style={{ color: '#ccc', maxWidth: '500px' }}>
                A client-side error occurred. We have been notified and are working on it.
            </p>
            {error.message && (
                <pre style={{
                    background: '#111',
                    padding: '15px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#888',
                    border: '1px solid #333',
                    maxWidth: '90%'
                }}>
                    {error.message}
                </pre>
            )}
            <div style={{ display: 'flex', gap: '15px' }}>
                <button
                    onClick={() => reset()}
                    style={{
                        padding: '12px 25px',
                        background: '#fff',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Try again
                </button>
                <Link
                    href="/"
                    style={{
                        padding: '12px 25px',
                        background: 'transparent',
                        color: '#fff',
                        border: '1px solid #fff',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        textDecoration: 'none'
                    }}
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
