const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('✅ User table exists and is accessible');
    console.log('Total users:', users.length);
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
