const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Verifying variants...');

    // Find a Heart Beat product
    const heartBeat = await prisma.product.findFirst({
        where: { groupId: 'heart-beat' }
    });

    if (!heartBeat) {
        console.error('No Heart Beat product found!');
        return;
    }

    console.log(`Found product: ${heartBeat.title} (Color: ${heartBeat.color})`);

    // Simulate API logic to find siblings
    const siblings = await prisma.product.findMany({
        where: {
            groupId: heartBeat.groupId,
            // id: { not: heartBeat.id } // API logic might include or exclude, let's see what we wrote.
            // In route.ts I removed the exclusion to simplify frontend.
        },
        select: {
            id: true,
            color: true,
            colorCode: true,
            image: true
        }
    });

    console.log(`Found ${siblings.length} siblings (including self):`);
    siblings.forEach(s => {
        console.log(`- ${s.color} (ID: ${s.id})`);
    });

    if (siblings.length < 3) {
        console.error('Expected at least 3 variants for Heart Beat!');
        process.exit(1);
    }

    console.log('Verification Passed!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
