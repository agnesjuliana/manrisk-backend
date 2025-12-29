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

interface AssetSeedData {
  name: string;
  location: string;
  type_title: string;
  classification_title: string;
  owner_email: string;
  status: string;
}

interface RiskSeedData {
  customRiskId: string;
  vulnerability: string;
  threat: string;
  identifiedRisk: string;
  detail: string;
  category_title: string;
  source_title: string;
  owner_email: string;
  context_name: string;
  isConfidentiality: string;
  isIntegrity: string;
  isAvailability: string;
  impactSeverity: string;
  likelihoodOccurence: string;
  detection: string;
}

interface RiskCriteriaSeedData {
  isFMEA: string;
  scale: string;
  threshold: string;
  createdAt: string;
  updatedAt: string;
}

interface ScaleStatusSeedData {
  level: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ControlSeedData {
  category: string;
  code: string;
  title: string;
  description: string;
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
    const existingType = await prisma.assetType.findFirst({
      where: {
        title: assetType.title,
        organizationId: null,
      },
    });

    if (existingType) {
      console.log(`✓ Asset Type ${assetType.title} sudah ada`);
      continue;
    }

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
    const existingClassification = await prisma.assetClassification.findFirst({
      where: {
        title: assetClassification.title,
        organizationId: null,
      },
    });

    if (existingClassification) {
      console.log(`✓ Asset Classification ${assetClassification.title} sudah ada`);
      continue;
    }

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

async function seedRiskCriteria() {
  console.log('🌱 Seeding risk criteria...');

  const csvPath = path.join(__dirname, 'data', 'risk-criteria.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const riskCriterias = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as RiskCriteriaSeedData[];

  // Get the fixed organization ID (first organization from seeding)
  const organization = await prisma.organization.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (!organization) {
    console.log('❌ No organization found for risk criteria seeding');
    return;
  }

  for (const criteria of riskCriterias) {
    // Check if risk criteria already exists
    const existingCriteria = await prisma.riskCriteria.findFirst({
      where: {
        organizationId: organization.id,
      },
    });

    if (existingCriteria) {
      console.log(`✓ Risk Criteria sudah ada`);
      continue;
    }

    const riskCriteria = await prisma.riskCriteria.create({
      data: {
        organizationId: organization.id,
        isFMEA: criteria.isFMEA === 'true',
        scale: parseInt(criteria.scale),
        threshold: parseInt(criteria.threshold),
        createdAt: new Date(criteria.createdAt),
        updatedAt: new Date(criteria.updatedAt),
      },
    });

    console.log(`✓ Risk Criteria berhasil dibuat dengan scale ${criteria.scale}`);

    // Now create scale statuses based on the scale value
    await seedScaleStatuses(riskCriteria.id);
  }
}

async function seedScaleStatuses(riskCriteriaId: string) {
  console.log('🌱 Seeding scale statuses...');

  const csvPath = path.join(__dirname, 'data', 'scale-statuses.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const scaleStatuses = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as ScaleStatusSeedData[];

  for (const status of scaleStatuses) {
    // Check if scale status already exists
    const existingStatus = await prisma.scaleStatus.findFirst({
      where: {
        riskCriteriaId: riskCriteriaId,
        level: parseInt(status.level),
      },
    });

    if (existingStatus) {
      console.log(`✓ Scale Status Level ${status.level} sudah ada`);
      continue;
    }

    await prisma.scaleStatus.create({
      data: {
        riskCriteriaId: riskCriteriaId,
        level: parseInt(status.level),
        title: status.title,
        createdAt: new Date(status.createdAt),
        updatedAt: new Date(status.updatedAt),
      },
    });

    console.log(`✓ Scale Status Level ${status.level} - ${status.title} berhasil dibuat`);
  }
}

async function seedAssets() {
  console.log('🌱 Seeding assets...');

  const csvPath = path.join(__dirname, 'data', 'assets.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const assets = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as AssetSeedData[];

  // Get the fixed organization ID (first organization from seeding)
  const organization = await prisma.organization.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (!organization) {
    console.log('❌ No organization found for asset seeding');
    return;
  }

  for (const asset of assets) {
    // Check if asset already exists
    const existingAsset = await prisma.asset.findFirst({
      where: {
        name: asset.name,
        organizationId: organization.id,
      },
    });

    if (existingAsset) {
      console.log(`✓ Asset ${asset.name} sudah ada`);
      continue;
    }

    // Look up asset type by title (global)
    const assetType = await prisma.assetType.findFirst({
      where: {
        title: asset.type_title,
        organizationId: null,
      },
    });

    if (!assetType) {
      console.log(`⚠️  Asset Type "${asset.type_title}" not found for asset ${asset.name}, skipping...`);
      continue;
    }

    // Look up asset classification by title (global)
    const assetClassification = await prisma.assetClassification.findFirst({
      where: {
        title: asset.classification_title,
        organizationId: null,
      },
    });

    if (!assetClassification) {
      console.log(`⚠️  Asset Classification "${asset.classification_title}" not found for asset ${asset.name}, skipping...`);
      continue;
    }

    // Look up owner user by email
    const owner = await prisma.user.findFirst({
      where: {
        email: asset.owner_email,
        organizationId: organization.id,
      },
    });

    if (!owner) {
      console.log(`⚠️  Owner with email "${asset.owner_email}" not found for asset ${asset.name}, skipping...`);
      continue;
    }

    await prisma.asset.create({
      data: {
        organizationId: organization.id,
        typeId: assetType.id,
        classificationId: assetClassification.id,
        ownerId: owner.id,
        name: asset.name,
        location: asset.location,
        status: asset.status as any,
      },
    });

    console.log(`✓ Asset ${asset.name} berhasil dibuat`);
  }
}

async function seedRisks() {
  console.log('🌱 Seeding risks...');

  const csvPath = path.join(__dirname, 'data', 'risks.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const risks = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as RiskSeedData[];

  // Get the fixed organization ID (first organization from seeding)
  const organization = await prisma.organization.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (!organization) {
    console.log('❌ No organization found for risk seeding');
    return;
  }

  for (const risk of risks) {
    // Check if risk already exists
    const existingRisk = await prisma.riskRegister.findFirst({
      where: {
        customRiskId: risk.customRiskId,
        organizationId: organization.id,
      },
    });

    if (existingRisk) {
      console.log(`✓ Risk ${risk.customRiskId} sudah ada`);
      continue;
    }

    // Look up risk category by title
    const riskCategory = await prisma.riskCategory.findFirst({
      where: {
        title: risk.category_title,
        organizationId: null, // Risk categories are global
      },
    });

    if (!riskCategory) {
      console.log(`⚠️  Risk Category "${risk.category_title}" not found for risk ${risk.customRiskId}, skipping...`);
      continue;
    }

    // Look up risk source by title
    const riskSource = await prisma.riskSource.findFirst({
      where: {
        title: risk.source_title,
        organizationId: null, // Risk sources are global
      },
    });

    if (!riskSource) {
      console.log(`⚠️  Risk Source "${risk.source_title}" not found for risk ${risk.customRiskId}, skipping...`);
      continue;
    }

    // Look up owner user by email
    const owner = await prisma.user.findFirst({
      where: {
        email: risk.owner_email,
        organizationId: organization.id,
      },
    });

    if (!owner) {
      console.log(`⚠️  Owner with email "${risk.owner_email}" not found for risk ${risk.customRiskId}, skipping...`);
      continue;
    }

    // Look up context by name
    const context = await prisma.context.findFirst({
      where: {
        name: risk.context_name,
        organizationId: organization.id,
      },
    });

    if (!context) {
      console.log(`⚠️  Context "${risk.context_name}" not found for risk ${risk.customRiskId}, skipping...`);
      continue;
    }

    await prisma.riskRegister.create({
      data: {
        organizationId: organization.id,
        customRiskId: risk.customRiskId,
        riskCategoryId: riskCategory.id,
        riskSourceId: riskSource.id,
        ownerId: owner.id,
        contextId: context.id,
        vulnerability: risk.vulnerability,
        threat: risk.threat,
        identifiedRisk: risk.identifiedRisk,
        detail: risk.detail,
        isConfidentiality: risk.isConfidentiality === 'true',
        isIntegrity: risk.isIntegrity === 'true',
        isAvailability: risk.isAvailability === 'true',
        impactSeverity: parseInt(risk.impactSeverity),
        likelihoodOccurence: parseInt(risk.likelihoodOccurence),
        detection: parseInt(risk.detection),
        status: 'DRAFT',
      },
    });

    console.log(`✓ Risk ${risk.customRiskId} berhasil dibuat`);
  }
}

async function seedControls() {
  console.log('🌱 Seeding controls...');

  const csvPath = path.join(__dirname, 'data', 'iso-control.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const controls = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as ControlSeedData[];

  for (const control of controls) {
    const existingControl = await prisma.control.findFirst({
      where: {
        code: control.code,
        organizationId: null,
      },
    });

    if (existingControl) {
      console.log(`✓ Control ${control.code} sudah ada`);
      continue;
    }

    await prisma.control.create({
      data: {
        code: control.code,
        category: control.category,
        title: control.title,
        description: control.description,
        isAnnex: true,
        organizationId: null,
      },
    });

    console.log(`✓ Control ${control.code} - ${control.title} berhasil dibuat`);
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
    await seedRiskCriteria();
    await seedAssets();
    await seedRisks();
    await seedControls();
    console.log('✅ Seeding selesai');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
