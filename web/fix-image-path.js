const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Update the product to use the correct relative path
        const updated = await prisma.product.update({
            where: { id: "cmjj7k7uh000514bat1n2knh9" },
            data: {
                image: "/black-front.png"
            }
        });
        console.log('Successfully fixed image path for:', updated.title);
    } catch (error) {
        console.error('Error fixing product:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
