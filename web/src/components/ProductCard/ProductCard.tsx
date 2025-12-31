import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    image: string;
    images?: string[];
    badge?: string;
}

const ProductCard = ({ id, title, price, image, images, badge }: ProductCardProps) => {
    const hasMultipleImages = images && images.length > 1;

    return (
        <Link href={`/product/${id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                {badge && <span className={styles.badge}>{badge}</span>}
                <Image
                    src={image}
                    alt={title}
                    fill
                    className={`${styles.image} ${hasMultipleImages ? styles.frontImage : ''}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {hasMultipleImages && (
                    <Image
                        src={images[1]}
                        alt={`${title} back`}
                        fill
                        className={`${styles.image} ${styles.backImage}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}
            </div>
            <div className={styles.info}>
                <h3 className={styles.title}>{title}</h3>
                <span className={styles.price}>{price.toLocaleString()} EGP</span>
            </div>
        </Link>
    );
};

export default ProductCard;
