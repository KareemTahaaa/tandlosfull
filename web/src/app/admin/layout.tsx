'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AdminNotificationProvider } from '@/context/AdminNotificationContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    return (
        <AdminNotificationProvider>
            <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f4', color: '#333', position: 'relative' }}>
                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '1rem',
                        zIndex: 1001,
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'none',
                        fontSize: '1.5rem',
                        lineHeight: '1'
                    }}
                    className="mobile-menu-btn"
                >
                    ☰
                </button>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 999,
                            display: 'none'
                        }}
                        className="mobile-overlay"
                    />
                )}

                {/* Sidebar */}
                <aside
                    style={{
                        width: '250px',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        zIndex: 1000
                    }}
                    className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
                >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
                        Tandlos Admin
                    </h2>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                        <Link href="/admin" onClick={() => setSidebarOpen(false)} style={{ color: '#fff', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                            Dashboard
                        </Link>
                        <Link href="/admin/orders" onClick={() => setSidebarOpen(false)} style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                            Orders
                        </Link>
                        <Link href="/admin/products" onClick={() => setSidebarOpen(false)} style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                            Products
                        </Link>
                        <Link href="/admin/promo-codes" onClick={() => setSidebarOpen(false)} style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                            Promo Codes
                        </Link>
                        <Link href="/admin/subscribers" onClick={() => setSidebarOpen(false)} style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                            Subscribers
                        </Link>
                    </nav>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/" onClick={() => setSidebarOpen(false)} style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                            ← Back to Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontWeight: 'bold'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }} className="admin-main">
                    {children}
                </main>
            </div>

            <style jsx global>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    
                    .mobile-overlay {
                        display: block !important;
                    }
                    
                    .admin-sidebar {
                        position: fixed !important;
                        top: 0;
                        left: -250px;
                        height: 100vh;
                        transition: left 0.3s ease;
                    }
                    
                    .admin-sidebar.open {
                        left: 0;
                    }
                    
                    .admin-main {
                        padding: 4rem 1rem 1rem 1rem !important;
                        width: 100%;
                    }
                }
            `}</style>
        </AdminNotificationProvider>
    );
}
