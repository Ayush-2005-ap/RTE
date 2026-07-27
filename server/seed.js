const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a slider
  await prisma.sliderSlide.create({
    data: {
      leftImageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', // Placeholder image
      leftCategory: 'Education',
      leftTitle: 'Welcome to Right to Education',
      leftDesc: 'Empowering citizens to track, advocate, and enforce the Right to Education Act 2009 across India.',
      rightLabel: 'RTE ACT 2009',
      rightTitle: 'Free and Compulsory Education',
      rightDesc: 'The RTE Act mandates free and compulsory education for all children between the ages of 6 and 14 in India.',
      isActive: true,
      order: 1
    }
  });

  // Create a book chapter
  await prisma.landingBook.create({
    data: {
      order: 1,
      type: 'contents',
      title: 'Table of Contents',
      desc: 'Overview of the Right to Education Act',
      items: [
        'Introduction to RTE',
        'Fundamental Rights',
        'School Responsibilities',
        'Teacher Qualifications'
      ]
    }
  });

  await prisma.landingBook.create({
    data: {
      order: 2,
      type: 'chapter',
      title: 'Chapter 1: The Right',
      desc: 'Every child of the age of six to fourteen years shall have a right to free and compulsory education in a neighbourhood school till completion of elementary education.'
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
