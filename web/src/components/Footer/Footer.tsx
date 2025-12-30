import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.column}>
                        <h3 className={styles.heading}>Shop</h3>
                        <Link href="/shop" className={styles.link}>All Products</Link>
                        <Link href="/collections" className={styles.link}>Collections</Link>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.heading}>Company</h3>
                        <Link href="/about" className={styles.link}>About Us</Link>
                        <Link href="/contact" className={styles.link}>Contact</Link>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.heading}>Support</h3>
                        <Link href="/shipping-returns" className={styles.link}>Shipping & Returns</Link>
                        <a href="mailto:tandlos.eg@gmail.com" className={styles.link}>Email Us</a>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.heading}>Follow Us</h3>
                        <div className={styles.social}>
                            <a href="#" className={styles.socialLink} aria-label="Instagram">Instagram</a>
                            <a href="#" className={styles.socialLink} aria-label="Facebook">Facebook</a>
                            <a href="#" className={styles.socialLink} aria-label="Twitter">Twitter</a>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Tandlos. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
