'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

interface NotificationContextType {
    showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function AdminNotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = (message: string, type: NotificationType) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        style={{
                            padding: '1rem 1.5rem',
                            borderRadius: '8px',
                            backgroundColor: notification.type === 'success' ? '#4CAF50' : notification.type === 'error' ? '#f44336' : '#2196F3',
                            color: 'white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            minWidth: '300px',
                            animation: 'slideIn 0.3s ease-out',
                            fontWeight: '500'
                        }}
                    >
                        {notification.message}
                    </div>
                ))}
            </div>
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </NotificationContext.Provider>
    );
}

export function useAdminNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useAdminNotification must be used within AdminNotificationProvider');
    }
    return context;
}
