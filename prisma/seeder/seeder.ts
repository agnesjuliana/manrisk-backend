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
  role: 'ADMIN' | 'RISK_MANAGER' | 'RISK_OWNER' | 'TOP_MANAGEMENT';
  organizationId?: string;
  departmentId?: string;
}

interface DepartmentSeedData {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  isActive?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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

interface AssetTypeSeedData {
  id?: string;
  organizationId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface AssetClassificationSeedData {
  id?: string;
  organizationId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface RiskCategorySeedData {
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface RiskSourceSeedData {
  title: string;
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
        organizationId: user.organizationId || null,
        departmentId: user.departmentId || null,
      },
    });

    console.log(`✓ User ${user.email} berhasil dibuat`);
  }
}

async function seedDepartments() {
  console.log('🌱 Seeding departments...');

  const csvPath = path.join(__dirname, 'data', 'departments.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const departments = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as DepartmentSeedData[];

  for (const department of departments) {
    const existingDepartment = await prisma.department.findUnique({
      where: { id: department.id },
    });

    if (existingDepartment) {
      console.log(`✓ Department ${department.name} sudah ada`);
      continue;
    }

    await prisma.department.create({
      data: {
        id: department.id,
        organizationId: department.organizationId,
        name: department.name || null,
        description: department.description || null,
        isActive: department.isActive ? department.isActive === 'true' : null,
        createdAt: new Date(department.createdAt),
        updatedAt: new Date(department.updatedAt),
        deletedAt: department.deletedAt ? new Date(department.deletedAt) : null,
      },
    });

    console.log(`✓ Department ${department.name} berhasil dibuat`);
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

async function seedAssetTypes() {
  console.log('🌱 Seeding asset types...');

  const csvPath = path.join(__dirname, 'data', 'asset-types.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const assetTypes = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as AssetTypeSeedData[];

  for (const assetType of assetTypes) {
    await prisma.assetType.create({
      data: {
        ...(assetType.id && { id: assetType.id }),
        organizationId: assetType.organizationId || null,
        title: assetType.title,
        createdAt: new Date(assetType.createdAt),
        updatedAt: new Date(assetType.updatedAt),
        deletedAt: assetType.deletedAt ? new Date(assetType.deletedAt) : null,
      },
    });

    console.log(`✓ Asset Type ${assetType.title} berhasil dibuat`);
  }
}

async function seedAssetClassifications() {
  console.log('🌱 Seeding asset classifications...');

  const csvPath = path.join(__dirname, 'data', 'asset-classifications.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const assetClassifications = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as AssetClassificationSeedData[];

  for (const assetClassification of assetClassifications) {
    await prisma.assetClassification.create({
      data: {
        ...(assetClassification.id && { id: assetClassification.id }),
        organizationId: assetClassification.organizationId || null,
        title: assetClassification.title,
        createdAt: new Date(assetClassification.createdAt),
        updatedAt: new Date(assetClassification.updatedAt),
        deletedAt: assetClassification.deletedAt ? new Date(assetClassification.deletedAt) : null,
      },
    });

    console.log(`✓ Asset Classification ${assetClassification.title} berhasil dibuat`);
  }
}

async function seedRiskCategories() {
  console.log('🌱 Seeding risk categories...');

  const csvPath = path.join(__dirname, 'data', 'risk-categories.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const riskCategories = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as RiskCategorySeedData[];

  for (const category of riskCategories) {
    const existingCategory = await prisma.riskCategory.findFirst({
      where: {
        title: category.title,
        organizationId: null,
      },
    });

    if (existingCategory) {
      console.log(`✓ Risk Category ${category.title} sudah ada`);
      continue;
    }

    await prisma.riskCategory.create({
      data: {
        organizationId: null,
        title: category.title,
        createdAt: new Date(category.createdAt),
        updatedAt: new Date(category.updatedAt),
        deletedAt: category.deletedAt ? new Date(category.deletedAt) : null,
      },
    });

    console.log(`✓ Risk Category ${category.title} berhasil dibuat`);
  }
}

async function seedRiskSources() {
  console.log('🌱 Seeding risk sources...');

  const csvPath = path.join(__dirname, 'data', 'risk-sources.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const riskSources = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as RiskSourceSeedData[];

  for (const source of riskSources) {
    const existingSource = await prisma.riskSource.findFirst({
      where: {
        title: source.title,
        organizationId: null,
      },
    });

    if (existingSource) {
      console.log(`✓ Risk Source ${source.title} sudah ada`);
      continue;
    }

    await prisma.riskSource.create({
      data: {
        organizationId: null,
        title: source.title,
        createdAt: new Date(source.createdAt),
        updatedAt: new Date(source.updatedAt),
        deletedAt: source.deletedAt ? new Date(source.deletedAt) : null,
      },
    });

    console.log(`✓ Risk Source ${source.title} berhasil dibuat`);
  }
}

async function main() {
  try {
    await seedOrganizations();
    await seedDepartments();
    await seedUsers();
    await seedContexts();
    await seedAssetTypes();
    await seedAssetClassifications();
    await seedRiskCategories();
    await seedRiskSources();
    console.log('✅ Seeding selesai');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
