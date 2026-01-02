"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './CheckoutPage.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiTrash2, FiAlertCircle } from 'react-icons/fi';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPhoneError, setShowPhoneError] = useState(false);

    // Geography State
    const [governorates, setGovernorates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [zones, setZones] = useState<any[]>([]);
    const [geoError, setGeoError] = useState<string | null>(null);

    const [selectedGov, setSelectedGov] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedZone, setSelectedZone] = useState<string>("");

    const [shippingFee, setShippingFee] = useState<number>(0);
    const [calculatingShipping, setCalculatingShipping] = useState(false);

    // Promo Code State
    const [promoCodeInput, setPromoCodeInput] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [promoError, setPromoError] = useState("");
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);

    // Fetch Governorates
    useEffect(() => {
        async function fetchGovs() {
            try {
                const res = await fetch('/api/shipping/governorates');
                const data = await res.json();
                let govList = Array.isArray(data) ? data : (data.results && Array.isArray(data.results) ? data.results : null);

                if (govList) {
                    // Filter out "no gov", "nogov" or similar invalid options
                    const filteredGovs = govList.filter((gov: any) =>
                        gov.name && !/no\s?gov/i.test(gov.name)
                    );
                    setGovernorates(filteredGovs);
                } else {
                    console.error("Invalid governorates data:", data);
                    setGeoError("Failed to load shipping locations. Please try again later.");
                }
            } catch (err) {
                console.error("Failed to fetch governorates", err);
                setGeoError("Connection error. Please check your internet.");
            }
        }
        fetchGovs();
    }, []);

    // Calculate Shipping Fee
    useEffect(() => {
        if (!selectedGov || cartTotal <= 0) {
            setShippingFee(0);
            return;
        }

        async function calculateFee() {
            setCalculatingShipping(true);
            try {
                const res = await fetch('/api/shipping/calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        governorateId: selectedGov,
                        cashAmount: cartTotal,
                        weight: 1000 // Default weight
                    })
                });
                const data = await res.json();

                if (res.ok && data.shippingFee !== undefined) {
                    setShippingFee(data.shippingFee);
                } else {
                    console.error("Calculation error:", data.error || "Unknown error");
                    setShippingFee(50); // Fallback on error
                }
            } catch (err) {
                console.error("Failed to calculate shipping fee", err);
                setShippingFee(50); // Fallback
            } finally {
                setCalculatingShipping(false);
            }
        }

        const timer = setTimeout(calculateFee, 500); // Debounce
        return () => clearTimeout(timer);
    }, [selectedGov, cartTotal]);

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
                if (Array.isArray(data)) {
                    setCities(data);
                } else if (data.results && Array.isArray(data.results)) {
                    setCities(data.results);
                }
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
                let zoneList = Array.isArray(data) ? data : (data.results && Array.isArray(data.results) ? data.results : null);

                if (zoneList) {
                    const filteredZones = zoneList.filter((zone: any) =>
                        zone.name && !zone.name.toLowerCase().includes('sort by shipblu')
                    );
                    setZones(filteredZones);
                }
            } catch (err) {
                console.error("Failed to fetch zones", err);
            }
        }
        fetchZones();
    }, [selectedCity]);

    const handleApplyPromo = async () => {
        if (!promoCodeInput) return;
        setIsApplyingPromo(true);
        setPromoError("");

        try {
            const res = await fetch('/api/promo/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCodeInput }),
            });
            const data = await res.json();

            if (res.ok) {
                setAppliedPromo(data);
                setPromoCodeInput("");
            } else {
                setPromoError(data.error || "Invalid promo code");
            }
        } catch (err) {
            setPromoError("Failed to validate promo code");
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const calculateDiscount = () => {
        if (!appliedPromo) return 0;
        if (appliedPromo.discountType === 'PERCENTAGE') {
            return (cartTotal * appliedPromo.discountValue) / 100;
        }
        return appliedPromo.discountValue;
    };

    const discountAmount = calculateDiscount();
    const finalTotal = cartTotal - discountAmount + Math.max(0, shippingFee - 25);

    if (cartItems.length === 0) {
        return (
            <div className={`container section ${styles.emptyCart}`}>
                <h2>Your Cart is Empty</h2>
                <Link href="/shop" className={styles.continueBtn}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const phone = formData.get('phone') as string;

        // Simple validation for Egyptian phone numbers
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            setShowPhoneError(true);
            setIsSubmitting(false);
            return;
        }

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
            total: finalTotal,
            promoCode: appliedPromo?.code
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
                                    {Array.isArray(governorates) && governorates.map(gov => (
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
                                    {Array.isArray(cities) && cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <select
                                name="zone"
                                className={styles.input}
                                required
                                value={selectedZone}
                                disabled={!selectedCity}
                                onChange={(e) => setSelectedZone(e.target.value)}
                            >
                                <option value="">Select Zone</option>
                                {Array.isArray(zones) && zones.map(zone => (
                                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                                ))}
                            </select>
                            {geoError && <p className={styles.errorMessage} style={{ color: '#f44336', fontSize: '0.8rem', marginTop: '10px' }}>{geoError}</p>}
                            <input name="phone" type="tel" placeholder="Phone" required className={styles.input} />
                        </div>

                        <div className={styles.section}>
                            <h2>Payment</h2>
                            <div className={styles.paymentMethod}>
                                <p>Cash on Delivery (COD)</p>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting || !selectedZone}>
                            {isSubmitting ? 'Processing...' : (!selectedZone ? 'Select Shipping Zone' : 'Place Order')}
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

                        <div className={styles.promoSection}>
                            <div className={styles.promoInputGroup}>
                                <input
                                    type="text"
                                    placeholder="Promo code"
                                    value={promoCodeInput}
                                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                                    className={styles.promoInput}
                                    disabled={isApplyingPromo}
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyPromo}
                                    className={styles.applyBtn}
                                    disabled={isApplyingPromo || !promoCodeInput}
                                >
                                    {isApplyingPromo ? '...' : 'Apply'}
                                </button>
                            </div>
                            {promoError && <p className={styles.promoError}>{promoError}</p>}
                            {appliedPromo && (
                                <div className={styles.appliedPromo}>
                                    <span>Code <strong>{appliedPromo.code}</strong> applied!</span>
                                    <button type="button" onClick={() => setAppliedPromo(null)}>Remove</button>
                                </div>
                            )}
                        </div>

                        <div className={styles.totals}>
                            <div className={styles.totalRow}>
                                <span>Subtotal</span>
                                <span>{cartTotal.toLocaleString()} EGP</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Shipping</span>
                                <span>{calculatingShipping ? 'Calculating...' : `${shippingFee.toLocaleString()} EGP`}</span>
                            </div>
                            {shippingFee > 0 && (
                                <div className={styles.totalRow} style={{ color: '#4caf50', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <span>Shipping Discount</span>
                                        <span>-25 EGP</span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontStyle: 'italic', fontWeight: '400' }}>
                                        We pay for some of the shipping fees because you are a lucky customer
                                    </span>
                                </div>
                            )}
                            {discountAmount > 0 && (
                                <div className={styles.totalRow} style={{ color: '#4caf50' }}>
                                    <span>Discount</span>
                                    <span>-{discountAmount.toLocaleString()} EGP</span>
                                </div>
                            )}
                            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                                <span>Total</span>
                                <span>{finalTotal.toLocaleString()} EGP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPhoneError && (
                <div className={styles.errorPopup} onClick={() => setShowPhoneError(false)}>
                    <div className={styles.errorPopupContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.errorPopupIcon}>
                            <FiAlertCircle />
                        </div>
                        <h3>Invalid Phone Number</h3>
                        <p>Please enter a valid Egyptian phone number (e.g., 01012345678) to complete your order.</p>
                        <button
                            className={styles.errorPopupButton}
                            onClick={() => setShowPhoneError(false)}
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
