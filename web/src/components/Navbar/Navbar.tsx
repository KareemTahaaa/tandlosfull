"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.leftActions}>
                    <button
                        className={styles.iconBtn}
                        aria-label="Menu"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="Tandlos Logo"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </Link>

                <div className={styles.rightActions}>
                    <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
                        <div style={{ position: 'relative' }}>
                            <FiShoppingBag />
                            {cartCount > 0 && (
                                <span className={styles.badge}>{cartCount}</span>
                            )}
                        </div>
                    </Link>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.menuOverlay} ${isMenuOpen ? styles.menuOpen : ''}`}>
                <div className={styles.menuLinks}>
                    <Link href="/shop" className={styles.menuLink} onClick={toggleMenu}>
                        Shop All
                    </Link>
                    <Link href="/contact" className={styles.menuLink} onClick={toggleMenu}>
                        Contact Us
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Navbar;
