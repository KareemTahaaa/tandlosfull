"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './CheckoutPage.module.css';
import { useRouter } from 'next/navigation';
import { FiTrash2 } from 'react-icons/fi';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (cartItems.length === 0) {
        return <div className="container section">Your cart is empty.</div>;
    }

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const orderData = {
            contact: {
                email: formData.get('email'),
                phone: formData.get('phone'),
            },
            shipping: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                address: formData.get('address'),
                city: formData.get('city'),
                governorate: formData.get('governorate'),
            },
            items: cartItems,
            total: cartTotal + 50
        };

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            // alert('Order Placed Successfully! Order ID: ' + data.orderId); // No longer needed
            clearCart();
            // Redirect to Thank You page with order number
            router.push(`/thank-you?orderId=${data.orderId}&orderNumber=${data.orderNumber}`);
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`container section ${styles.checkoutPage}`}>
            <h1 className={styles.heading}>Checkout</h1>

            <div className={styles.grid}>
                <div className={styles.formColumn}>
                    <form onSubmit={handlePlaceOrder} className={styles.form}>
                        <div className={styles.section}>
                            <h2>Contact Information</h2>
                            <input name="email" type="email" placeholder="Email" required className={styles.input} />
                        </div>

                        <div className={styles.section}>
                            <h2>Shipping Address</h2>
                            <div className={styles.row}>
                                <input name="firstName" type="text" placeholder="First Name" required className={styles.input} />
                                <input name="lastName" type="text" placeholder="Last Name" required className={styles.input} />
                            </div>
                            <input name="address" type="text" placeholder="Address" required className={styles.input} />
                            <input name="apartment" type="text" placeholder="Apartment, suite, etc. (optional)" className={styles.input} />
                            <div className={styles.row}>
                                <input name="city" type="text" placeholder="City" required className={styles.input} />
                                <input name="governorate" type="text" placeholder="Governorate" required className={styles.input} />
                                <input name="postalCode" type="text" placeholder="Postal Code" className={styles.input} />
                            </div>
                            <input name="phone" type="tel" placeholder="Phone" required className={styles.input} />
                        </div>

                        <div className={styles.section}>
                            <h2>Payment</h2>
                            <div className={styles.paymentMethod}>
                                <p>Cash on Delivery (COD)</p>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>

                <div className={styles.summaryColumn}>
                    <div className={styles.summaryCard}>
                        <h2>Order Summary</h2>
                        <div className={styles.itemList}>
                            {cartItems.map(item => (
                                <div key={`${item.id}-${item.size}`} className={styles.summaryItem}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div className={styles.Badge}>
                                            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <span className={styles.qtyBadge}>{item.quantity}</span>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.title}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#888' }}>{item.size}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                                        <p style={{ fontSize: '0.9rem' }}>{(item.price * item.quantity).toLocaleString()} EGP</p>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            type="button"
                                            title="Remove item"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.totals}>
                            <div className={styles.totalRow}>
                                <span>Subtotal</span>
                                <span>{cartTotal.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Shipping</span>
                                <span>50 EGP</span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                                <span>Total</span>
                                <span>{(cartTotal + 50).toLocaleString()} EGP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
