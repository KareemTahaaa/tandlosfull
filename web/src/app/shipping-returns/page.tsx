import styles from './ShippingReturnsPage.module.css';

export default function ShippingReturnsPage() {
    return (
        <div className={`container section ${styles.page}`}>
            <div className={styles.hero}>
                <h1 className={styles.title}>Shipping & Returns</h1>
                <p className={styles.subtitle}>Everything you need to know</p>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.icon}>🚚</span>
                        <h2>Shipping Information</h2>
                    </div>

                    <div className={styles.card}>
                        <h3>Delivery Time</h3>
                        <p className={styles.highlight}>3-5 Business Days</p>
                        <p>
                            We partner with reliable courier services to ensure your order arrives safely and on time.
                            Orders are typically delivered within 3-5 business days from the date of purchase.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h3>Shipping Coverage</h3>
                        <p>We currently ship to all governorates across Egypt, including:</p>
                        <ul className={styles.list}>
                            <li>Cairo & Giza</li>
                            <li>Alexandria</li>
                            <li>Delta Region</li>
                            <li>Upper Egypt</li>
                            <li>Coastal Cities</li>
                        </ul>
                    </div>

                    <div className={styles.card}>
                        <h3>Tracking Your Order</h3>
                        <p>
                            Once your order ships, you'll receive a confirmation email with tracking information.
                            You can monitor your delivery status in real-time.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.icon}>↩️</span>
                        <h2>Returns Policy</h2>
                    </div>

                    <div className={`${styles.card} ${styles.important}`}>
                        <h3>⚠️ Important: Returns at Delivery Only</h3>
                        <p className={styles.highlight}>
                            Returns are only accepted while the courier is at your door
                        </p>
                        <p>
                            You must inspect your order upon delivery. If you wish to return an item,
                            you must inform the courier immediately before they leave. Once the courier
                            departs, we cannot accept returns or exchanges.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h3>Valid Return Reasons</h3>
                        <p>We accept returns at delivery for the following reasons:</p>
                        <ul className={styles.list}>
                            <li><strong>Wrong item:</strong> You received a different product than ordered</li>
                            <li><strong>Damaged item:</strong> The product arrived damaged or defective</li>
                            <li><strong>Wrong size:</strong> The size doesn't match your order</li>
                            <li><strong>Quality issues:</strong> The item has manufacturing defects</li>
                        </ul>
                    </div>

                    <div className={styles.card}>
                        <h3>Return Process</h3>
                        <ol className={styles.orderedList}>
                            <li>Inspect your order when the courier arrives</li>
                            <li>If there's an issue, inform the courier immediately</li>
                            <li>The courier will take the item back</li>
                            <li>Contact us at <a href="mailto:tandlos.eg@gmail.com">tandlos.eg@gmail.com</a></li>
                            <li>We'll process your refund or send a replacement</li>
                        </ol>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.icon}>💡</span>
                        <h2>Tips for a Smooth Delivery</h2>
                    </div>

                    <div className={styles.tipsGrid}>
                        <div className={styles.tip}>
                            <h4>📦 Inspect Immediately</h4>
                            <p>Check your order as soon as it arrives</p>
                        </div>
                        <div className={styles.tip}>
                            <h4>📸 Take Photos</h4>
                            <p>Document any issues before the courier leaves</p>
                        </div>
                        <div className={styles.tip}>
                            <h4>✅ Try It On</h4>
                            <p>If possible, try the item on while the courier waits</p>
                        </div>
                        <div className={styles.tip}>
                            <h4>📞 Have Questions Ready</h4>
                            <p>Contact us before delivery if you have concerns</p>
                        </div>
                    </div>
                </section>

                <div className={styles.contact}>
                    <h2>Need Help?</h2>
                    <p>If you have any questions about shipping or returns, we're here to help.</p>
                    <a href="mailto:tandlos.eg@gmail.com" className={styles.emailButton}>
                        Contact Us: tandlos.eg@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}
