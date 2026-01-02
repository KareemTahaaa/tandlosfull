const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRODUCTS = [
    {
        title: 'Midnight Wave Crewneck',
        description: 'A soft French terry crewneck with stitched sleeves and a raised puff-print back graphic.',
        price: 799,
        originalPrice: 1000,
        image: '/crewneck-black-front.png',
        images: ['/crewneck-black-front.png', '/crewneck-black-back.png'],
        stock: 50,
    },
    {
        title: 'Ash Wave Crewneck',
        description: 'A soft French terry crewneck with stitched sleeves and a raised puff-print back graphic.',
        price: 799,
        originalPrice: 1000,
        image: '/crewneck-grey-front.png',
        images: ['/crewneck-grey-front.png', '/crewneck-grey-back.png'],
        stock: 50,
    },
    {
        title: 'Pink Wave Crewneck',
        description: 'A soft French terry crewneck with stitched sleeves and a raised puff-print back graphic.',
        price: 799,
        originalPrice: 1000,
        image: '/crewneck-pink-front.png',
        images: ['/crewneck-pink-front.png', '/crewneck-pink-back.png'],
        stock: 50,
    },
    {
        title: 'Black Phantom Fleece',
        description: 'Full black fleece Jacket with tonal stitching and a full hood',
        price: 999,
        originalPrice: 1200,
        image: '/phantom-black.png',
        images: [
            '/phantom-black.png',
            '/black phantom mockup.png'
        ],
        stock: 50,
    },
    {
        title: 'GreyXBlack Phantom Fleece',
        description: 'Dual-tone fleece jacket with tonal stitching and a full hood',
        price: 999,
        originalPrice: 1200,
        image: '/phantom-greyxblack.png',
        images: ['/phantom-greyxblack.png'],
        stock: 50,
    },
    {
        title: 'BlackXGrey Phantom Fleece',
        description: 'Dual-tone fleece jacket with tonal stitching and a full hood',
        price: 999,
        originalPrice: 1200,
        image: '/phantom-blackxgrey.png',
        images: ['/phantom-blackxgrey.png'],
        stock: 50,
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
    await prisma.customer.deleteMany({});
    await prisma.product.deleteMany({});
    // Note: We keep subscribers and orders for now unless we really want a clean slate

    for (const p of PRODUCTS) {
        // Separate stock calculation from product data
        const initialStock = p.stock;
        const productData = { ...p };
        delete productData.stock;

        await prisma.product.create({
            data: {
                ...productData,
                stocks: {
                    create: getStockForSizes(initialStock, p.title)
                }
            },
        });
        console.log(`Created product: ${p.title}`);
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
