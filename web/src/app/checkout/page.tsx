"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './CheckoutPage.module.css';
import { useRouter } from 'next/navigation';
import { FiTrash2 } from 'react-icons/fi';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Geography State
    const [governorates, setGovernorates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [zones, setZones] = useState<any[]>([]);

    const [selectedGov, setSelectedGov] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedZone, setSelectedZone] = useState<string>("");

    // Fetch Governorates
    useEffect(() => {
        async function fetchGovs() {
            try {
                const res = await fetch('/api/shipping/governorates');
                const data = await res.json();
                setGovernorates(data.results || data);
            } catch (err) {
                console.error("Failed to fetch governorates", err);
            }
        }
        fetchGovs();
    }, []);

    // Fetch Cities
    useEffect(() => {
        if (!selectedGov) {
            setCities([]);
            return;
        }
        async function fetchCities() {
            try {
                const res = await fetch(`/api/shipping/cities?governorateId=${selectedGov}`);
                const data = await res.json();
                setCities(data.results || data);
            } catch (err) {
                console.error("Failed to fetch cities", err);
            }
        }
        fetchCities();
    }, [selectedGov]);

    // Fetch Zones
    useEffect(() => {
        if (!selectedCity) {
            setZones([]);
            return;
        }
        async function fetchZones() {
            try {
                const res = await fetch(`/api/shipping/zones?cityId=${selectedCity}`);
                const data = await res.json();
                setZones(data.results || data);
            } catch (err) {
                console.error("Failed to fetch zones", err);
            }
        }
        fetchZones();
    }, [selectedCity]);

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
                city: cities.find(c => c.id.toString() === selectedCity)?.name || "",
                governorate: governorates.find(g => g.id.toString() === selectedGov)?.name || "",
            },
            zoneId: parseInt(selectedZone),
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
                                <select
                                    name="governorate"
                                    className={styles.input}
                                    required
                                    value={selectedGov}
                                    onChange={(e) => {
                                        setSelectedGov(e.target.value);
                                        setSelectedCity("");
                                        setSelectedZone("");
                                    }}
                                >
                                    <option value="">Select Governorate</option>
                                    {governorates.map(gov => (
                                        <option key={gov.id} value={gov.id}>{gov.name}</option>
                                    ))}
                                </select>
                                <select
                                    name="city"
                                    className={styles.input}
                                    required
                                    value={selectedCity}
                                    disabled={!selectedGov}
                                    onChange={(e) => {
                                        setSelectedCity(e.target.value);
                                        setSelectedZone("");
                                    }}
                                >
                                    <option value="">Select City</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.row}>
                                <select
                                    name="zone"
                                    className={styles.input}
                                    required
                                    value={selectedZone}
                                    disabled={!selectedCity}
                                    onChange={(e) => setSelectedZone(e.target.value)}
                                >
                                    <option value="">Select Zone</option>
                                    {zones.map(zone => (
                                        <option key={zone.id} value={zone.id}>{zone.name}</option>
                                    ))}
                                </select>
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
