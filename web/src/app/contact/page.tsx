import styles from './ContactPage.module.css';

export default function ContactPage() {
    return (
        <div className={`container section ${styles.page}`}>
            <div className={styles.hero}>
                <h1 className={styles.title}>Contact Us</h1>
                <p className={styles.subtitle}>We&apos;re here to help</p>
            </div>

            <div className={styles.content}>
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <div className={styles.icon}>📧</div>
                        <h3>Email Us</h3>
                        <p>For any questions, concerns, or feedback</p>
                        <a href="mailto:tandlos.eg@gmail.com" className={styles.link}>
                            tandlos.eg@gmail.com
                        </a>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.icon}>⏰</div>
                        <h3>Response Time</h3>
                        <p>We typically respond within</p>
                        <strong>24-48 hours</strong>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.icon}>📍</div>
                        <h3>Location</h3>
                        <p>Based in Egypt</p>
                        <strong>Serving nationwide</strong>
                    </div>
                </div>

                <div className={styles.infoSection}>
                    <h2>What can we help you with?</h2>
                    <div className={styles.topics}>
                        <div className={styles.topic}>
                            <h4>🛍️ Orders & Shipping</h4>
                            <p>Questions about your order, delivery status, or shipping options</p>
                        </div>
                        <div className={styles.topic}>
                            <h4>↩️ Returns & Exchanges</h4>
                            <p>Need to return or exchange an item? We&apos;re here to help</p>
                        </div>
                        <div className={styles.topic}>
                            <h4>👕 Product Information</h4>
                            <p>Questions about sizing, materials, or care instructions</p>
                        </div>
                        <div className={styles.topic}>
                            <h4>💬 General Inquiries</h4>
                            <p>Collaborations, press, or any other questions</p>
                        </div>
                    </div>
                </div>

                <div className={styles.cta}>
                    <h2>Ready to reach out?</h2>
                    <a href="mailto:tandlos.eg@gmail.com" className={styles.emailButton}>
                        Send us an email
                    </a>
                </div>
            </div>
        </div>
    );
}
