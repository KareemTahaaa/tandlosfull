'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useAnalytics() {
    const pathname = usePathname();

    useEffect(() => {
        // Track Page View
        const trackView = async () => {
            try {
                // Ignore admin and api routes
                if (pathname?.startsWith('/admin') || pathname?.startsWith('/api')) return;

                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'VISIT',
                        page: pathname
                    })
                });
            } catch (error) {
                // Silently fail
            }
        };

        if (pathname) trackView();
    }, [pathname]);

    const trackAction = async (type: string, details?: any) => {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, page: pathname, details })
            });
        } catch (error) {
            // Silently fail
        }
    };

    return { trackAction };
}
