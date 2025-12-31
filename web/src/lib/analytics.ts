// Google Analytics helper functions

declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'js' | 'set',
            targetId: string | Date,
            config?: Record<string, unknown>
        ) => void;
    }
}

// Track page views
export const pageview = (url: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
            page_path: url,
        });
    }
};

// Track custom events
export const event = ({
    action,
    category,
    label,
    value,
}: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// Track email signup
export const trackEmailSignup = () => {
    event({
        action: 'signup',
        category: 'engagement',
        label: 'email_subscription',
    });
};

// Track form submission
export const trackFormSubmit = (formName: string) => {
    event({
        action: 'submit',
        category: 'form',
        label: formName,
    });
};
