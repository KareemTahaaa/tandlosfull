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

                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.heading}>Support</h3>
                        <Link href="/about" className={styles.link}>About Us</Link>
                        <Link href="/shipping-returns" className={styles.link}>Shipping & Returns</Link>
                        <Link href="/contact" className={styles.link}>Contact</Link>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.heading}>Follow Us</h3>
                        <div className={styles.social}>
                            <a href="https://www.instagram.com/tandlos.eg?igsh=MXd3Nnd5Y2hnMThiMA==" className={styles.socialLink} aria-label="Instagram">Instagram</a>
                            <a href="https://www.tiktok.com/@tandlos.eg?_t=8m4FMBavYco&_r=1" className={styles.socialLink} aria-label="Facebook">TikTok</a>

                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        developed by ©Kareem Taha
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
