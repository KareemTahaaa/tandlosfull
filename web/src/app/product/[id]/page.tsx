"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { FiArrowLeft } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import AddToCartAnimation from '@/components/AddToCartAnimation';
import styles from './ProductPage.module.css';

const VirtualTryOn = dynamic(
    () => import('@/components/VirtualTryOn/VirtualTryOn'),
    { ssr: false }
);

import ReviewSection from './ReviewSection';
import RelatedProducts from './RelatedProducts';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    images: string[];
    stocks: { size: string; quantity: number }[];
    siblings?: { id: string; color: string; colorCode: string; image: string }[];
}

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { showNotification } = useNotification();
    const { trackAction } = useAnalytics();

    // State
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [showSizeError, setShowSizeError] = useState(false);
    const [showTryOn, setShowTryOn] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [triggerCartAnimation, setTriggerCartAnimation] = useState(false);

    const id = params.id as string;

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) {
                    setLoading(false);
                    return;
                };
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchProduct();
    }, [id]);

    if (loading) {
        return <div className="container section">Loading...</div>;
    }

    if (!product) {
        return <div className="container section">Product not found</div>;
    }

    const galleryImages = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    const validateSize = () => {
        if (!selectedSize) {
            setShowSizeError(true);
            return false;
        }
        setShowSizeError(false);
        return true;
    };

    const handleAddToCart = () => {
        if (!validateSize()) return;

        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            size: selectedSize!
        });

        trackAction('ADD_TO_CART', {
            productId: product.id,
            title: product.title,
            price: product.price,
            size: selectedSize
        });

        // Trigger 3D animation
        setTriggerCartAnimation(true);
        showNotification('Added to cart', 'success');
    };

    const getStockForSize = (size: string | null) => {
        if (!size || !product) return 0;
        const stockEntry = product.stocks.find(s => s.size === size);
        return stockEntry ? stockEntry.quantity : 0;
    };

    const inStock = selectedSize ? getStockForSize(selectedSize) > 0 : product.stocks.some(s => s.quantity > 0);

    const isCrewneck = product.title.toLowerCase().includes('crewneck');
    const isJacket = product.title.toLowerCase().includes('fleece') || product.title.toLowerCase().includes('jacket');
    const sizeGuideImage = isCrewneck ? '/crewneck-size-guide.png' : (isJacket ? '/jacket-size-guide.png' : null);

    return (
        <div className={`container ${styles.productPage}`}>
            <button onClick={() => router.back()} className={styles.backButton}>
                <FiArrowLeft size={24} />
                <span>Back</span>
            </button>
            <div className={styles.gallery}>
                <div className={styles.mainImage}>
                    <Image
                        src={galleryImages[activeImageIndex]}
                        alt={product.title}
                        fill
                        className={styles.image}
                        priority
                    />
                </div>
                {galleryImages.length > 1 && (
                    <div className={styles.thumbnails}>
                        {galleryImages.map((img, idx) => (
                            <button
                                key={idx}
                                className={`${styles.thumbnail} ${activeImageIndex === idx ? styles.activeThumbnail : ''}`}
                                onClick={() => setActiveImageIndex(idx)}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.title} view ${idx + 1}`}
                                    fill
                                    className={styles.thumbnailImg}
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.details}>
                <h1 className={styles.title}>{product.title}</h1>
                <div className={styles.priceContainer}>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className={styles.originalPrice}>{product.originalPrice.toLocaleString()} EGP</span>
                    )}
                    <p className={styles.price}>{product.price.toLocaleString()} EGP</p>
                </div>

                <div className={styles.section}>
                    <p className={styles.label}>Description</p>
                    <p className={styles.description}>{product.description}</p>
                    <p className={styles.description} style={{ marginTop: '10px', color: inStock ? '#4CAF50' : '#f44336' }}>
                        {selectedSize
                            ? (inStock ? 'In Stock' : 'Out of Stock')
                            : (inStock ? 'Select a size to see availability' : 'Out of Stock')
                        }
                    </p>
                </div>

                {product.siblings && product.siblings.length > 0 && (
                    <div className={styles.section}>
                        <p className={styles.label}>Select Color</p>
                        <div className={styles.colors}>
                            {product.siblings.map(sibling => (
                                <button
                                    key={sibling.id}
                                    className={`${styles.colorBtn} ${sibling.id === product.id ? styles.activeColor : ''}`}
                                    style={{ backgroundColor: sibling.colorCode || '#ccc' }}
                                    title={sibling.color || 'Color'}
                                    onClick={() => router.push(`/product/${sibling.id}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.section}>
                    <p className={styles.label}>Select Size</p>
                    <div className={styles.sizes}>
                        {(() => {
                            // Helper to sort sizes: XS < S < M < L < XL < XXL
                            const sizeOrder = { 'XS': 0, 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5 };
                            const availableSizes = product.stocks
                                .map(s => s.size)
                                .sort((a, b) => {
                                    const aOrder = sizeOrder[a as keyof typeof sizeOrder] ?? 99;
                                    const bOrder = sizeOrder[b as keyof typeof sizeOrder] ?? 99;
                                    return aOrder - bOrder;
                                });

                            // If no stock entries (unlikely), fallback or show nothing
                            const sizesToShow = availableSizes.length > 0 ? availableSizes : ['S', 'M', 'L', 'XL'];

                            return sizesToShow.map(size => {
                                const sizeStock = getStockForSize(size);
                                const isAvailable = sizeStock > 0;
                                return (
                                    <button
                                        key={size}
                                        className={`${styles.sizeBtn} ${selectedSize === size ? styles.active : ''} ${showSizeError ? styles.error : ''} ${!isAvailable ? styles.outOfStock : ''}`}
                                        onClick={() => {
                                            setSelectedSize(size);
                                            setShowSizeError(false);
                                        }}
                                    >
                                        {size}
                                    </button>
                                );
                            });
                        })()}
                        {sizeGuideImage && (
                            <button
                                className={styles.sizeGuideBtn}
                                onClick={() => setShowSizeGuide(true)}
                            >
                                Size Guide
                            </button>
                        )}
                    </div>
                    {showSizeError && <p className={styles.errorMessage}>Please select a size to continue</p>}
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        className={styles.tryOnBtn}
                        onClick={() => setShowTryOn(true)}
                    >
                        👕 Try It On
                    </button>
                    <button
                        className={styles.addToCartBtn}
                        onClick={handleAddToCart}
                        disabled={selectedSize ? !inStock : true} // Disabled if no size or out of stock
                        style={{ opacity: (selectedSize && inStock) ? 1 : 0.5, cursor: (selectedSize && inStock) ? 'pointer' : 'not-allowed' }}
                    >
                        {selectedSize ? (inStock ? 'Add to Cart' : 'Sold Out') : 'Select Size'}
                    </button>
                </div>
                <button
                    className={styles.buyNowBtn}
                    onClick={() => {
                        if (!validateSize()) return;

                        addToCart({
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            image: product.image,
                            size: selectedSize!
                        });
                        router.push('/checkout');
                    }}
                    disabled={selectedSize ? !inStock : false}
                    style={{
                        opacity: (selectedSize && !inStock) ? 0.5 : 1,
                        cursor: (selectedSize && !inStock) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {selectedSize && !inStock ? 'Sold Out' : 'Buy Now'}
                </button>

                {showTryOn && (
                    <VirtualTryOn
                        productTitle={product.title}
                        onClose={() => setShowTryOn(false)}
                    />
                )}

                {showSizeGuide && (
                    <div className={styles.modalOverlay} onClick={() => setShowSizeGuide(false)}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <button
                                className={styles.closeModalBtn}
                                onClick={() => setShowSizeGuide(false)}
                            >
                                ×
                            </button>
                            <h3>Size Guide</h3>
                            <div className={styles.sizeGuideImageWrapper}>
                                <Image
                                    src={sizeGuideImage || ''}
                                    alt={`${product.title} Size Guide`}
                                    width={500}
                                    height={500}
                                    className={styles.sizeGuideImage}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
                <RelatedProducts currentProductId={product.id} />
                {/* <ReviewSection productId={product.id} productTitle={product.title} productImage={product.image} /> */}
            </div>

            {/* 3D Add to Cart Animation */}
            <AddToCartAnimation
                trigger={triggerCartAnimation}
                productImage={product.image}
                onComplete={() => setTriggerCartAnimation(false)}
            />
        </div>
    );
}
