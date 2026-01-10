'use client';

import { motion } from 'framer-motion';

export default function LoadingAnimation() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: '20px'
        }}>
            {/* 3D Rotating Logo/Spinner */}
            <motion.div
                style={{
                    width: '80px',
                    height: '80px',
                    position: 'relative'
                }}
                animate={{
                    rotateY: [0, 360],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            >
                {/* T-shirt icon made of shapes */}
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                    <motion.path
                        d="M30,20 L20,35 L20,90 L80,90 L80,35 L70,20 L60,25 L50,20 L40,25 Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                        animate={{
                            fill: ['#000', '#666', '#000'],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    />
                </svg>
            </motion.div>

            {/* Pulsing dots */}
            <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#000'
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: 'easeInOut'
                        }}
                    />
                ))}
            </div>

            <motion.p
                style={{
                    fontSize: '14px',
                    color: '#666',
                    fontWeight: '500'
                }}
                animate={{
                    opacity: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            >
                Loading...
            </motion.p>
        </div>
    );
}
