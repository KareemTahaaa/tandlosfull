"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingBag, FiMenu, FiSearch } from 'react-icons/fi';
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const { cartCount } = useCart();

    return (
        <nav className={styles.navbar}>
            <div className={styles.actions}>
                {/* Mobile Menu Icon (Visible only on mobile via CSS usually, but here simple for now) */}
                <button className={styles.iconBtn} aria-label="Menu">
                    <FiMenu />
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

            <div className={styles.navLinks}>
                <Link href="/shop" className={styles.navLink}>Shop All</Link>
                <Link href="/collections" className={styles.navLink}>Collections</Link>


            </div>

            <div className={styles.actions}>
                <button className={styles.iconBtn} aria-label="Search">
                    <FiSearch />
                </button>
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
    );
};

export default Navbar;
