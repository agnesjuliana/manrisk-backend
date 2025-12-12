import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding users...');

  const users = [
    {
      email: 'admin@example.com',
      password: 'Admin@123',
      name: 'Admin User',
      role: 'ADMIN' as const,
    },
    {
      email: 'manager@example.com',
      password: 'Manager@123',
      name: 'Risk Manager',
      role: 'RISK_MANAGER' as const,
    },
    {
      email: 'owner@example.com',
      password: 'Owner@123',
      name: 'Risk Owner',
      role: 'RISK_OWNER' as const,
    },
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      console.log(`✓ User ${user.email} sudah ada`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: user.role,
      },
    });

    console.log(`✓ User ${user.email} berhasil dibuat`);
  }
}

async function main() {
  try {
    await seedUsers();
    console.log('✅ Seeding selesai');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
