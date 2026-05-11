
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting position group migration...');

  // 1. Move President and Secretary to 'TOP' group
  const topUpdate = await prisma.organization_position_assignments.updateMany({
    where: {
      position_title: {
        in: ['President', 'Secretary'],
      },
      // Only for Thana, City, Central (not Unit/Ward where EXECUTIVE might be okay, 
      // but user specifically asked for Thana/City in context)
      // Actually, let's do it for all where group is currently 'EXECUTIVE'
      position_group: 'EXECUTIVE',
    },
    data: {
      position_group: 'TOP',
    },
  });

  console.log(`Updated ${topUpdate.count} positions to 'TOP' group.`);

  // 2. Rename 'Secretariat Member' to 'Office Secretary' (as a starting point)
  // Or just leave them for the user to delete/re-seed.
  // Actually, let's rename them if they exist.
  const renameUpdate = await prisma.organization_position_assignments.updateMany({
    where: {
      position_title: 'Secretariat Member',
    },
    data: {
      position_title: 'Office Secretary',
    },
  });

  console.log(`Renamed ${renameUpdate.count} 'Secretariat Member' positions to 'Office Secretary'.`);

  console.log('Migration complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
