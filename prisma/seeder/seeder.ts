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

interface ContextSeedData {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface OrganizationSeedData {
  id: string;
  name: string;
  address: string;
  email: string;
  noTelp: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

async function seedOrganizations() {
  console.log('🌱 Seeding organizations...');

  const csvPath = path.join(__dirname, 'data', 'organizations.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const organizations = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as OrganizationSeedData[];

  for (const organization of organizations) {
    const existingOrganization = await prisma.organization.findUnique({
      where: { id: organization.id },
    });

    if (existingOrganization) {
      console.log(`✓ Organization ${organization.name} sudah ada`);
      continue;
    }

    await prisma.organization.create({
      data: {
        id: organization.id,
        name: organization.name,
        address: organization.address,
        email: organization.email,
        noTelp: organization.noTelp,
        createdAt: new Date(organization.createdAt),
        updatedAt: new Date(organization.updatedAt),
        deletedAt: organization.deletedAt ? new Date(organization.deletedAt) : null,
      },
    });

    console.log(`✓ Organization ${organization.name} berhasil dibuat`);
  }
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

async function seedContexts() {
  console.log('🌱 Seeding contexts...');

  const csvPath = path.join(__dirname, 'data', 'contexts.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const contexts = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as ContextSeedData[];

  for (const context of contexts) {
    const existingContext = await prisma.context.findUnique({
      where: { id: context.id },
    });

    if (existingContext) {
      console.log(`✓ Context ${context.name} sudah ada`);
      continue;
    }

    await prisma.context.create({
      data: {
        id: context.id,
        organizationId: context.organizationId,
        name: context.name,
        description: context.description,
        createdAt: new Date(context.createdAt),
        updatedAt: new Date(context.updatedAt),
        deletedAt: context.deletedAt ? new Date(context.deletedAt) : null,
      },
    });

    console.log(`✓ Context ${context.name} berhasil dibuat`);
  }
}

async function main() {
  try {
    await seedOrganizations();
    await seedUsers();
    await seedContexts();
    console.log('✅ Seeding selesai');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
