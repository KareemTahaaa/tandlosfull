const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRODUCTS = [
    {
        title: 'Cascade Heavyweight Hoodie',
        description: 'The Cascade Hoodie is crafted from premium heavyweight cotton for ultimate comfort and durability.',
        price: 2100,
        originalPrice: 2500,
        image: '/black-front.png',
        images: ['/black-front.png', '/black-back.png'],
        stock: 50,
    },
    {
        title: 'Essential Black Tee',
        description: 'A wardrobe staple redefined. 100% organic cotton with a boxy fit.',
        price: 950,
        // No discount for this item
        image: '/tandlos-sweater.png',
        stock: 100,
    },
    {
        title: 'Signature Sweatpants',
        description: 'Matching bottoms for the Cascade Hoodie. Elasticated cuffs and waist.',
        price: 1800,
        originalPrice: 2200,
        image: '/tandlos-sweater.png',
        stock: 30,
    },
    {
        title: 'Utility Vest - Black',
        description: 'Multi-pocket tactical vest. Water-resistant nylon shell.',
        price: 2500,
        image: '/tandlos-sweater.png',
        stock: 10,
    },
    {
        title: 'Oversized Graphic Tee',
        description: 'Heavyweight tee with screen printed back graphic.',
        price: 1100,
        image: '/tandlos-sweater.png',
        stock: 75,
    },
    {
        title: 'Cargo Parachute Pants',
        description: 'Lightweight technical fabric with adjustable cord lock hems.',
        price: 2200,
        originalPrice: 2800,
        image: '/tandlos-sweater.png',
        stock: 25,
    },
];

// Helper to generate stock distribution
const SIZES = ['S', 'M', 'L', 'XL'];
function getStockForSizes(totalStock, title) {
    const stockPerSize = Math.floor(totalStock / SIZES.length);
    return SIZES.map(size => ({
        size,
        quantity: stockPerSize,
        productTitle: title // Snapshot of title
    }));
}

async function main() {
    console.log('Start seeding ...');
    // Clear existing data to avoid conflicts during re-seed
    await prisma.productStock.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.product.deleteMany({});

    for (const p of PRODUCTS) {
        // Separate stock calculation from product data
        const initialStock = p.stock;
        const productData = { ...p };
        delete productData.stock;

        const product = await prisma.product.create({
            data: {
                ...productData,
                stocks: {
                    create: getStockForSizes(initialStock, p.title)
                }
            },
        });
        console.log(`Created product with id: ${product.id} and distributed stock.`);
    }
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
