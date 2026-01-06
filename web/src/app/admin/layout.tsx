import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f4', color: '#333' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: '#1a1a1a', color: '#fff', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
                    Tandlos Admin
                </h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                        Dashboard
                    </Link>
                    <Link href="/admin/orders" style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                        Orders (Coming Soon)
                    </Link>
                    <Link href="/admin/products" style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px' }}>
                        Products (Coming Soon)
                    </Link>
                    <Link href="/" style={{ color: '#aaa', textDecoration: 'none', padding: '0.5rem', borderRadius: '4px', marginTop: '2rem' }}>
                        ← Back to Site
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
}
