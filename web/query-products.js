const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const products = await prisma.product.findMany();
        console.log(JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Error querying products:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
