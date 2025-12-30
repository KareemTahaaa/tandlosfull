"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';

    return (
        <>
            {!isLandingPage && <Navbar />}
            <main style={{ minHeight: '100vh' }}>
                {children}
            </main>
            {!isLandingPage && <Footer />}
        </>
    );
}
