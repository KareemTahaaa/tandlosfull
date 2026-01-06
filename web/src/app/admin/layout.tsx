'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f4', color: '#333' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: '#1a1a1a', color: '#fff', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
                    Tandlos Admin
                </h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                        Dashboard
                    </Link>
                    <Link href="/admin/orders" style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                        Orders
                    </Link>
                    <Link href="/admin/products" style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                        Products
                    </Link>
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link href="/" style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
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
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
