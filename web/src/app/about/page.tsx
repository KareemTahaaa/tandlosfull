import styles from './AboutPage.module.css';

export default function AboutPage() {
    return (
        <div className={`container section ${styles.page}`}>
            <div className={styles.hero}>
                <h1 className={styles.title}>About Tandlos</h1>
                <p className={styles.subtitle}>Redefining Egyptian Streetwear</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2>Our Story</h2>
                    <p>
                        Tandlos is an Egyptian streetwear brand born from a passion for bold design and authentic self-expression.
                        We believe that clothing is more than fabric—it's a statement, a movement, and a way of life.
                    </p>
                    <p>
                        Founded in Egypt, we draw inspiration from the vibrant energy of our streets, the rich heritage of our culture,
                        and the fearless spirit of our youth. Every piece we create is designed to empower you to stand out, be different,
                        and embrace your unique identity.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Our Mission</h2>
                    <p>
                        To create premium streetwear that blends modern aesthetics with timeless quality. We're committed to delivering
                        clothing that not only looks good but feels good—pieces that you'll wear with pride and confidence.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Why Tandlos?</h2>
                    <ul className={styles.list}>
                        <li><strong>Premium Quality:</strong> We use only the finest materials and craftsmanship</li>
                        <li><strong>Unique Designs:</strong> Limited drops that you won't find anywhere else</li>
                        <li><strong>Egyptian Pride:</strong> Designed and inspired by Egyptian culture</li>
                        <li><strong>Sustainable:</strong> We care about our planet and our community</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>Join the Movement</h2>
                    <p>
                        Tandlos is more than a brand—it's a community of individuals who dare to be different.
                        Follow us on social media, share your style, and be part of the Tandlos family.
                    </p>
                </section>

                <section className={styles.contact}>
                    <h2>Get in Touch</h2>
                    <p>Have questions or feedback? We'd love to hear from you.</p>
                    <a href="mailto:tandlos.eg@gmail.com" className={styles.email}>
                        tandlos.eg@gmail.com
                    </a>
                </section>
            </div>
        </div>
    );
}
