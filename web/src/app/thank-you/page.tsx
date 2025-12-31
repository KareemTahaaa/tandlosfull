"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

// Separate component to use useSearchParams inside Suspense
function ThankYouContent() {
    const searchParams = useSearchParams();
    // Get params
    const orderNumber = searchParams.get('orderNumber');

    // Simple protection: if no params, maybe redirect home or show basic message
    // but for now, we just display what we have.

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            gap: '20px'
        }}>
            <FiCheckCircle size={80} color="#4CAF50" />
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-family-heading)', textTransform: 'uppercase' }}>
                Thank You!
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc' }}>
                Your order has been placed successfully.
            </p>

            <div style={{
                background: '#111',
                padding: '30px',
                borderRadius: '8px',
                border: '1px solid #333',
                margin: '20px 0',
                minWidth: '300px'
            }}>
                <p style={{ color: '#888', marginBottom: '10px' }}>Order Number</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
                    #{orderNumber || 'Pending'}
                </p>

            </div>

            <p style={{ maxWidth: '600px', lineHeight: '1.6', color: '#888' }}>
                We&apos;ve received your order and are working on it.
                You will receive an email confirmation shortly.
            </p>

            <Link href="/" style={{
                marginTop: '30px',
                padding: '15px 40px',
                background: '#fff',
                color: '#000',
                textDecoration: 'none',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderRadius: '4px'
            }}>
                Continue Shopping
            </Link>
        </div>
    );
}

export default function ThankYouPage() {
    return (
        <div className="container section">
            <Suspense fallback={<div>Loading...</div>}>
                <ThankYouContent />
            </Suspense>
        </div>
    );
}
