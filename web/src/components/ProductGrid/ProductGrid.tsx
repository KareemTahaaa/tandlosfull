import styles from './ProductGrid.module.css';

interface ProductGridProps {
    children: React.ReactNode;
}

const ProductGrid = ({ children }: ProductGridProps) => {
    return (
        <div className={styles.grid}>
            {children}
        </div>
    );
};

export default ProductGrid;
