const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Update the specific product with front and back images
        const updated = await prisma.product.update({
            where: { id: "cmjj7k7uh000514bat1n2knh9" },
            data: {
                image: "/black-front.png",
                images: ["/black-front.png", "/black-back.png"]
            }
        });
        console.log('Successfully updated product images for:', updated.title);
    } catch (error) {
        console.error('Error updating product:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
