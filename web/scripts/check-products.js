const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Listing all products...');
    const products = await prisma.product.findMany({});
    console.log(`Total products: ${products.length}`);
    products.forEach(p => {
        console.log(`- ${p.title} (Group: ${p.groupId}, Color: ${p.color})`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
