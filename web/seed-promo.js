const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const promo = await prisma.promoCode.upsert({
        where: { code: 'FIRST1000' },
        update: {
            discountType: 'PERCENTAGE',
            discountValue: 10, // 10% discount
            isActive: true
        },
        create: {
            code: 'FIRST1000',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            isActive: true
        }
    });
    console.log('Promo code created/updated:', promo);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
