"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';
    const isAdmin = pathname?.startsWith('/admin');

    useAnalytics();

    return (
        <>
            {!isLandingPage && !isAdmin && <Navbar />}
            <main style={{ minHeight: '100vh' }}>
                {children}
            </main>
            {!isLandingPage && !isAdmin && <Footer />}
        </>
    );
}
