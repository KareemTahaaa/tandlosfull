const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const updated = await prisma.product.update({
            where: { id: "cmjj7k7uh000514bat1n2knh9" },
            data: {
                title: "Tandlos Premium Longsleeve",
                description: "A heavyweight premium cotton longsleeve featuring a minimalist front and a bold 'tandlos' back graphic. Signature boxy fit.",
                image: "/black-front.png"
            }
        });
        console.log('Successfully updated product:', updated.title);
    } catch (error) {
        console.error('Error updating product:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
