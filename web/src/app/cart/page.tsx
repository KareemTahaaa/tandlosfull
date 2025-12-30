"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './CartPage.module.css';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

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

    return (
        <div className={`container section ${styles.cartPage}`}>
            <h1 className={styles.heading}>Shopping Cart</h1>

            <div className={styles.content}>
                <div className={styles.items}>
                    {cartItems.map((item) => (
                        <div key={`${item.id}-${item.size}`} className={styles.item}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                            <div className={styles.details}>
                                <div className={styles.info}>
                                    <h3>{item.title}</h3>
                                    <p className={styles.variant}>Size: {item.size}</p>
                                    <p className={styles.price}>{item.price.toLocaleString()} EGP</p>
                                </div>

                                <div className={styles.actions}>
                                    <div className={styles.quantity}>
                                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>+</button>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromCart(item.id, item.size)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.summary}>
                    <h2>Order Summary</h2>
                    <div className={styles.row}>
                        <span>Subtotal</span>
                        <span>{cartTotal.toLocaleString()} EGP</span>
                    </div>
                    <div className={styles.row}>
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                    </div>
                    <div className={`${styles.row} ${styles.total}`}>
                        <span>Total</span>
                        <span>{cartTotal.toLocaleString()} EGP</span>
                    </div>
                    <Link href="/checkout" className={styles.checkoutBtn}>
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
