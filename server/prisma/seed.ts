import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.deal.createMany({
    data: [
      {
        id: 'deal-credit',
        title: 'Buy tyres on credit',
        description: 'Flexible tyre replacement plans for members and fleets.',
        tag: 'Finance',
        route: '/deals/credit',
        sortOrder: 0,
      },
      {
        id: 'deal-maz',
        title: 'MAZ member scheme',
        description: 'Preferential offers for registered transport operators.',
        tag: 'Partner',
        route: '/deals/maz',
        sortOrder: 1,
      },
      {
        id: 'deal-buy',
        title: 'Buy tyres',
        description: 'Browse popular fitments, brands, and service bundles.',
        tag: 'Shop',
        route: '/deals/buy-tyres',
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.branch.createMany({
    data: [
      {
        id: 'samora',
        name: 'Tyre Club Samora',
        address: 'Samora Machel Avenue, Harare',
        hours: 'Mon-Fri 08:00-17:00, Sat 08:00-13:00',
        phone: '+263 24 270 1900',
        sortOrder: 0,
      },
      {
        id: 'msasa',
        name: 'Tyre Club Msasa',
        address: 'Mutare Road, Msasa',
        hours: 'Mon-Fri 08:00-17:00',
        phone: '+263 24 244 0118',
        sortOrder: 1,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.product.createMany({
    data: [
      {
        id: 'prd-001',
        name: 'Passenger tyres',
        category: 'Tyres',
        description: 'Popular city, SUV, and performance tyre fitments.',
        sortOrder: 0,
      },
      {
        id: 'prd-002',
        name: 'Wheel balancing',
        category: 'Services',
        description: 'Balancing, alignment checks, and rotation support.',
        sortOrder: 1,
      },
      {
        id: 'prd-003',
        name: 'Fleet inspections',
        category: 'Fleet',
        description: 'Scheduled checkups, compliance reporting, and advice.',
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });

  console.warn('Seed complete: deals, branches, products.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
