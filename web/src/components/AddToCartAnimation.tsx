'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CartAnimationProps {
    trigger: boolean;
    productImage: string;
    onComplete: () => void;
}

export default function AddToCartAnimation({ trigger, productImage, onComplete }: CartAnimationProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (trigger) {
            setShow(true);
            setTimeout(() => {
                setShow(false);
                onComplete();
            }, 1000);
        }
    }, [trigger, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                        width: '100px',
                        height: '100px',
                        opacity: 1
                    }}
                    animate={{
                        left: '90%',
                        top: '5%',
                        width: '40px',
                        height: '40px',
                        opacity: 0.5,
                        scale: [1, 1.2, 0.3],
                        rotate: [0, 10, -10, 0]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    style={{
                        backgroundImage: `url(${productImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        pointerEvents: 'none'
                    }}
                />
            )}
        </AnimatePresence>
    );
}
