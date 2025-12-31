"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface NotificationContextType {
    showNotification: (message: string, type?: 'success' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [type, setType] = useState<'success' | 'error'>('success');

    const showNotification = useCallback((msg: string, t: 'success' | 'error' = 'success') => {
        setMessage(msg);
        setType(t);
        setIsVisible(true);

        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {isVisible && (
                <div className={`toast-container ${type}`}>
                    <div className="toast-message">
                        {type === 'success' && <span className="icon">✓</span>}
                        {message}
                    </div>
                </div>
            )}
            <style jsx>{`
                .toast-container {
                    position: fixed;
                    top: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10001;
                    padding: 12px 24px;
                    border-radius: 8px;
                    background-color: #000;
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    animation: slideDown 0.3s ease-out;
                    border: 1px solid #333;
                    min-width: 250px;
                    text-align: center;
                }
                .toast-container.success {
                    border-bottom: 3px solid #4CAF50;
                }
                .toast-container.error {
                    border-bottom: 3px solid #f44336;
                }
                .toast-message {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.9rem;
                }
                .icon {
                    color: #4CAF50;
                    font-weight: bold;
                }
                @keyframes slideDown {
                    from { transform: translate(-50%, -20px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
