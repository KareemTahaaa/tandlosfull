const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        // Determine the sequence name. Usually it's "Order_orderNumber_seq" but depends on postgres version/prisma defaults.
        // We can try to query distinct sequences if needed, but the default naming convention is usually reliable.
        // Double quotes are important for case sensitivity in Postgres.
        await prisma.$executeRawUnsafe('ALTER SEQUENCE "Order_orderNumber_seq" RESTART WITH 1000;');
        console.log('Successfully reset Order_orderNumber_seq to 1000');
    } catch (e) {
        console.error('Error resetting sequence:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
