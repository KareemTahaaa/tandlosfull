'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/admin');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#000',
            color: '#fff'
        }}>
            <form onSubmit={handleLogin} style={{
                padding: '2rem',
                border: '1px solid #333',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h1>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Admin Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            paddingRight: '2.5rem',
                            borderRadius: '4px',
                            border: '1px solid #333',
                            backgroundColor: '#111',
                            color: '#fff'
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer'
                        }}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#fff',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Verifying...' : 'Login'}
                </button>
            </form>
        </div>
    );
}
