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
        groupId: 'midnight-wave',
        color: 'Black',
        colorCode: '#000000',
    },
    {
        title: 'Ash Wave Crewneck',
        description: 'A soft French terry crewneck with stitched sleeves and a raised puff-print back graphic.',
        price: 799,
        originalPrice: 1000,
        image: '/crewneck-grey-front.png',
        images: ['/crewneck-grey-front.png', '/crewneck-grey-back.png'],
        stock: 50,
        groupId: 'ash-wave',
        color: 'Grey',
        colorCode: '#808080',
    },
    {
        title: 'Pink Wave Crewneck',
        description: 'A soft French terry crewneck with stitched sleeves and a raised puff-print back graphic.',
        price: 799,
        originalPrice: 1000,
        image: '/crewneck-pink-front.png',
        images: ['/crewneck-pink-front.png', '/crewneck-pink-back.png'],
        stock: 50,
        groupId: 'pink-wave',
        color: 'Pink',
        colorCode: '#FFC0CB',
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
        groupId: 'phantom-fleece',
        color: 'Black',
        colorCode: '#000000',
    },
    {
        title: 'GreyXBlack Phantom Fleece',
        description: 'Dual-tone fleece jacket with tonal stitching and a full hood',
        price: 999,
        originalPrice: 1200,
        image: '/phantom-greyxblack.png',
        images: ['/phantom-greyxblack.png'],
        stock: 50,
        groupId: 'phantom-fleece-gxb',
        color: 'Grey/Black',
        colorCode: '#555555',
    },
    {
        title: 'BlackXGrey Phantom Fleece',
        description: 'Dual-tone fleece jacket with tonal stitching and a full hood',
        price: 999,
        originalPrice: 1200,
        image: '/phantom-blackxgrey.png',
        images: ['/phantom-blackxgrey.png'],
        stock: 50,
        groupId: 'phantom-fleece-bxg',
        color: 'Black/Grey',
        colorCode: '#333333',
    },
    // New Products
    // Heart Beat
    {
        title: 'Heart Beat Long Sleeve Top (Black)',
        description: 'Heart Beat design on a long sleeve top.',
        price: 799,
        originalPrice: 1000,
        image: '/heart-beat-black-1.png',
        images: ['/heart-beat-black-1.png', '/heart-beat-black-2.png', '/heart-beat-black-3.png'],
        stock: 50,
        groupId: 'heart-beat',
        color: 'Black',
        colorCode: '#000000',
        sizes: ['XS', 'S', 'M', 'L'],
    },
    {
        title: 'Heart Beat Long Sleeve Top (Pink)',
        description: 'Heart Beat design on a long sleeve top.',
        price: 799,
        originalPrice: 1000,
        image: '/heart-beat-pink-1.png',
        images: ['/heart-beat-pink-1.png', '/heart-beat-pink-2.png'],
        stock: 50,
        groupId: 'heart-beat',
        color: 'Pink',
        colorCode: '#FFC0CB',
        sizes: ['XS', 'S', 'M', 'L'],
    },
    {
        title: 'Heart Beat Long Sleeve Top (Red)',
        description: 'Heart Beat design on a long sleeve top.',
        price: 799,
        originalPrice: 1000,
        image: '/heart-beat-red.png', // Placeholder
        images: ['/heart-beat-red.png'],
        stock: 50,
        groupId: 'heart-beat',
        color: 'Red',
        colorCode: '#FF0000',
        sizes: ['XS', 'S', 'M', 'L'],
    },
    // Love Pulse
    {
        title: 'Love Pulse Long Sleeve Top (Black)',
        description: 'Love Pulse design on a long sleeve top.',
        price: 799,
        originalPrice: 1000,
        image: '/love-pulse-black.png', // Placeholder
        images: ['/love-pulse-black.png'],
        stock: 50,
        groupId: 'love-pulse',
        color: 'Black',
        colorCode: '#000000',
        sizes: ['XS', 'S', 'M', 'L'],
    },
    {
        title: 'Love Pulse Long Sleeve Top (Pink)',
        description: 'Love Pulse design on a long sleeve top.',
        price: 799,
        originalPrice: 1000,
        image: '/love-pulse-pink-1.png',
        images: ['/love-pulse-pink-1.png', '/love-pulse-pink-2.png', '/love-pulse-pink-3.png', '/love-pulse-pink-4.png'],
        stock: 50,
        groupId: 'love-pulse',
        color: 'Pink',
        colorCode: '#FFC0CB',
        sizes: ['XS', 'S', 'M', 'L'],
    },
    {
        title: 'Love Pulse Long Sleeve Top (Red)',
        description: 'Love Pulse design on a long sleeve top.',
        price: 799,
        originalPrice: 1000,
        image: '/love-pulse-red-1.png',
        images: ['/love-pulse-red-1.png', '/love-pulse-red-2.png', '/love-pulse-red-3.png'],
        stock: 50,
        groupId: 'love-pulse',
        color: 'Red',
        colorCode: '#FF0000',
        sizes: ['XS', 'S', 'M', 'L'],
    },
];

// Helper to generate stock distribution
// Helper to generate stock distribution
const DEFAULT_SIZES = ['S', 'M', 'L', 'XL'];
function getStockForSizes(totalStock, title, sizes = DEFAULT_SIZES) {
    const stockPerSize = Math.floor(totalStock / sizes.length);
    return sizes.map(size => ({
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
        delete productData.sizes;

        await prisma.product.create({
            data: {
                ...productData,
                stocks: {
                    create: getStockForSizes(initialStock, p.title, p.sizes)
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
