import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.backgroundOverlay} />
            <div className={styles.content}>
                <h1 className={styles.headline}>
                    What you are looking for isn&apos;t out there,<br />It&apos;s in here.
                </h1>
                <p className={styles.subheadline}>
                    Discover the new collection defined by comfort and authenticity.
                </p>
                <Link href="/shop" className={styles.ctaButton}>
                    Shop Now
                </Link>
            </div>
        </section>
    );
};

export default Hero;
