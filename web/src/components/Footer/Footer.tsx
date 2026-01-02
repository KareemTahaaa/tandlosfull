import Link from 'next/link';
import { FaInstagram, FaTiktok } from 'react-icons/fa6';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.subscribeSection}>
                    <h3 className={styles.heading}>BE PART OF THE FAM</h3>
                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.input}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.subscribeButton}>
                            SUBSCRIBE
                        </button>
                    </form>
                </div>

                <div className={styles.links}>
                    <Link href="/shop" className={styles.link}>SHOP ALL</Link>
                    <Link href="/privacy" className={styles.link}>PRIVACY POLICY</Link>
                    <Link href="/shipping-returns" className={styles.link}>SHIPPING</Link>
                    <Link href="/returns" className={styles.link}>RETURNS</Link>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.social}>
                        <a
                            href="https://www.instagram.com/tandlos.eg?igsh=MXd3Nnd5Y2hnMThiMA=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="Instagram"
                        >
                            <FaInstagram size={18} />
                        </a>
                        <a
                            href="https://www.tiktok.com/@tandlos.eg?_t=8m4FMBavYco&_r=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="TikTok"
                        >
                            <FaTiktok size={18} />
                        </a>
                    </div>
                    <p className={styles.copyright}>
                        developed by ©Kareem Taha
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
