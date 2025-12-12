import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserSeedData {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'RISK_MANAGER' | 'RISK_OWNER';
}

async function seedUsers() {
  console.log('🌱 Seeding users...');

  const csvPath = path.join(__dirname, 'data', 'users.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const users = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as UserSeedData[];

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
