import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TOrganizationSeedData {
  id: string;
  name: string;
  address: string;
  email: string;
  noTelp: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TDepartmentSeedData {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  isActive?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TUserSeedData {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'RISK_MANAGER' | 'RISK_OWNER' | 'TOP_MANAGEMENT';
  organizationId?: string;
  departmentId?: string;
}

interface TContextSeedData {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TCIASeedData {
  id: string;
  organizationId: string;
  type: 'C' | 'I' | 'A';
  value: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TServiceSeedData {
  id: string;
  organizationId: string;
  contextId: string;
  serviceName: string;
  cScore: string;
  iScore: string;
  aScore: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TExternalStakeholderSeedData {
  id: string;
  organizationId: string;
  name: string;
  interest: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TRegulationSeedData {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TAssetSeedData {
  id: string;
  name: string;
  location: string;
  type_title: string;
  classification_title: string;
  owner_email: string;
  status: string;
}

interface TScaleStatusSeedData {
  level: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface TRiskCriteriaSeedData {
  id: string;
  organizationId: string;
  isFMEA: string;
  scale: string;
  threshold: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TRiskCategorySeedData {
  id: string;
  organizationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TRiskSourceSeedData {
  id: string;
  organizationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface TRiskSeedData {
  customRiskId: string;
  assetId: string;
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

async function seedTOrganizations() {
  console.log('🌱 Seeding t_organizations...');

  const csvPath = path.join(__dirname, 'data', 't_organization.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const organizations = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TOrganizationSeedData[];

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

async function seedTDepartments() {
  console.log('🌱 Seeding t_departments...');

  const csvPath = path.join(__dirname, 'data', 't_department.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const departments = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TDepartmentSeedData[];

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

async function seedTUsers() {
  console.log('🌱 Seeding t_users...');

  const csvPath = path.join(__dirname, 'data', 't_user.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const users = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TUserSeedData[];

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

async function seedTContexts() {
  console.log('🌱 Seeding t_contexts...');

  const csvPath = path.join(__dirname, 'data', 't_context.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const contexts = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TContextSeedData[];

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

async function seedTCIAObjectives() {
  console.log('🌱 Seeding t_cia_objectives...');

  const csvPath = path.join(__dirname, 'data', 't_cia.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const ciaObjectives = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TCIASeedData[];

  for (const cia of ciaObjectives) {
    const existingCIA = await prisma.cIAObjective.findFirst({
      where: {
        organizationId: cia.organizationId,
        type: cia.type,
      },
    });

    if (existingCIA) {
      console.log(`✓ CIA Objective ${cia.type} sudah ada`);
      continue;
    }

    await prisma.cIAObjective.create({
      data: {
        id: cia.id,
        organizationId: cia.organizationId,
        type: cia.type,
        value: cia.value,
        createdAt: new Date(cia.createdAt),
        updatedAt: new Date(cia.updatedAt),
        deletedAt: cia.deletedAt ? new Date(cia.deletedAt) : null,
      },
    });

    console.log(`✓ CIA Objective ${cia.type} berhasil dibuat`);
  }
}

async function seedTServices() {
  console.log('🌱 Seeding t_services...');

  const csvPath = path.join(__dirname, 'data', 't_service.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const services = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TServiceSeedData[];

  for (const service of services) {
    const existingService = await prisma.servicePriority.findUnique({
      where: { id: service.id },
    });

    if (existingService) {
      console.log(`✓ Service Priority ${service.serviceName} sudah ada`);
      continue;
    }

    await prisma.servicePriority.create({
      data: {
        id: service.id,
        organizationId: service.organizationId,
        contextId: service.contextId,
        serviceName: service.serviceName,
        cScore: parseInt(service.cScore),
        iScore: parseInt(service.iScore),
        aScore: parseInt(service.aScore),
        createdAt: new Date(service.createdAt),
        updatedAt: new Date(service.updatedAt),
        deletedAt: service.deletedAt ? new Date(service.deletedAt) : null,
      },
    });

    console.log(`✓ Service Priority ${service.serviceName} berhasil dibuat`);
  }
}

async function seedTExternalStakeholders() {
  console.log('🌱 Seeding t_external_stakeholders...');

  const csvPath = path.join(__dirname, 'data', 't_external_stakeholder.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const stakeholders = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TExternalStakeholderSeedData[];

  for (const stakeholder of stakeholders) {
    const existingStakeholder = await prisma.externalStakeholder.findUnique({
      where: { id: stakeholder.id },
    });

    if (existingStakeholder) {
      console.log(`✓ External Stakeholder ${stakeholder.name} sudah ada`);
      continue;
    }

    await prisma.externalStakeholder.create({
      data: {
        id: stakeholder.id,
        organizationId: stakeholder.organizationId,
        name: stakeholder.name,
        interest: stakeholder.interest,
        createdAt: new Date(stakeholder.createdAt),
        updatedAt: new Date(stakeholder.updatedAt),
        deletedAt: stakeholder.deletedAt ? new Date(stakeholder.deletedAt) : null,
      },
    });

    console.log(`✓ External Stakeholder ${stakeholder.name} berhasil dibuat`);
  }
}

async function seedTRegulations() {
  console.log('🌱 Seeding t_regulations...');

  const csvPath = path.join(__dirname, 'data', 't_regulation.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const regulations = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TRegulationSeedData[];

  for (const regulation of regulations) {
    const existingRegulation = await prisma.regulation.findUnique({
      where: { id: regulation.id },
    });

    if (existingRegulation) {
      console.log(`✓ Regulation ${regulation.name} sudah ada`);
      continue;
    }

    await prisma.regulation.create({
      data: {
        id: regulation.id,
        organizationId: regulation.organizationId,
        name: regulation.name,
        createdAt: new Date(regulation.createdAt),
        updatedAt: new Date(regulation.updatedAt),
        deletedAt: regulation.deletedAt ? new Date(regulation.deletedAt) : null,
      },
    });

    console.log(`✓ Regulation ${regulation.name} berhasil dibuat`);
  }
}

async function seedTAssets() {
  console.log('🌱 Seeding t_assets...');

  const csvPath = path.join(__dirname, 'data', 't_asset.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const assets = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TAssetSeedData[];

  // Get the SMK Telkom Malang organization
  const organization = await prisma.organization.findFirst({
    where: {
      name: 'SMK Telkom Malang',
    },
  });

  if (!organization) {
    console.log('❌ Organization SMK Telkom Malang not found for asset seeding');
    return;
  }

  for (const asset of assets) {
    const existingAsset = await prisma.asset.findUnique({
      where: {
        id: asset.id,
      },
    });

    if (existingAsset) {
      console.log(`✓ Asset ${asset.name} sudah ada`);
      continue;
    }

    // Look up asset type
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

    // Look up asset classification
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

    // Look up owner user
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
        id: asset.id,
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

async function seedTRiskCriteria() {
  console.log('🌱 Seeding t_risk_criteria...');

  const csvPath = path.join(__dirname, 'data', 't_risk_criteria.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const riskCriterias = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TRiskCriteriaSeedData[];

  for (const criteria of riskCriterias) {
    const existingCriteria = await prisma.riskCriteria.findUnique({
      where: { id: criteria.id },
    });

    if (existingCriteria) {
      console.log(`✓ Risk Criteria for organization ${criteria.organizationId} sudah ada`);
      continue;
    }

    await prisma.riskCriteria.create({
      data: {
        id: criteria.id,
        organizationId: criteria.organizationId,
        isFMEA: criteria.isFMEA === 'true',
        scale: parseInt(criteria.scale),
        threshold: parseInt(criteria.threshold),
        createdAt: new Date(criteria.createdAt),
        updatedAt: new Date(criteria.updatedAt),
        deletedAt: criteria.deletedAt ? new Date(criteria.deletedAt) : null,
      },
    });

    console.log(`✓ Risk Criteria dengan scale ${criteria.scale} dan threshold ${criteria.threshold} berhasil dibuat`);
  }
}

async function seedTScaleStatuses() {
  console.log('🌱 Seeding t_scale_statuses...');

  const csvPath = path.join(__dirname, 'data', 't_scale-statuses.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const scaleStatuses = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TScaleStatusSeedData[];

  // Get the SMK Telkom Malang organization to find its risk criteria
  const organization = await prisma.organization.findFirst({
    where: {
      name: 'SMK Telkom Malang',
    },
  });

  if (!organization) {
    console.log('❌ Organization SMK Telkom Malang not found for scale status seeding');
    return;
  }

  // Get risk criteria for this organization (should already be created by seedTRiskCriteria)
  const riskCriteria = await prisma.riskCriteria.findFirst({
    where: {
      organizationId: organization.id,
    },
  });

  if (!riskCriteria) {
    console.log('❌ Risk Criteria not found for SMK Telkom Malang. Please run seedTRiskCriteria first.');
    return;
  }

  for (const status of scaleStatuses) {
    const existingStatus = await prisma.scaleStatus.findFirst({
      where: {
        riskCriteriaId: riskCriteria.id,
        level: parseInt(status.level),
      },
    });

    if (existingStatus) {
      console.log(`✓ Scale Status Level ${status.level} sudah ada`);
      continue;
    }

    await prisma.scaleStatus.create({
      data: {
        riskCriteriaId: riskCriteria.id,
        level: parseInt(status.level),
        title: status.title,
        createdAt: new Date(status.createdAt),
        updatedAt: new Date(status.updatedAt),
      },
    });

    console.log(`✓ Scale Status Level ${status.level} - ${status.title} berhasil dibuat`);
  }
}

async function seedTRiskCategories() {
  console.log('🌱 Seeding t_risk_categories...');

  const csvPath = path.join(__dirname, 'data', 't_risk-categories.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const riskCategories = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TRiskCategorySeedData[];

  for (const category of riskCategories) {
    const existingCategory = await prisma.riskCategory.findUnique({
      where: {
        id: category.id,
      },
    });

    if (existingCategory) {
      console.log(`✓ Risk Category ${category.title} sudah ada`);
      continue;
    }

    await prisma.riskCategory.create({
      data: {
        id: category.id,
        organizationId: category.organizationId,
        title: category.title,
        createdAt: new Date(category.createdAt),
        updatedAt: new Date(category.updatedAt),
        deletedAt: category.deletedAt ? new Date(category.deletedAt) : null,
      },
    });

    console.log(`✓ Risk Category ${category.title} berhasil dibuat`);
  }
}

async function seedTRiskSources() {
  console.log('🌱 Seeding t_risk_sources...');

  const csvPath = path.join(__dirname, 'data', 't_risk-sources.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const riskSources = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TRiskSourceSeedData[];

  for (const source of riskSources) {
    const existingSource = await prisma.riskSource.findUnique({
      where: {
        id: source.id,
      },
    });

    if (existingSource) {
      console.log(`✓ Risk Source ${source.title} sudah ada`);
      continue;
    }

    await prisma.riskSource.create({
      data: {
        id: source.id,
        organizationId: source.organizationId,
        title: source.title,
        createdAt: new Date(source.createdAt),
        updatedAt: new Date(source.updatedAt),
        deletedAt: source.deletedAt ? new Date(source.deletedAt) : null,
      },
    });

    console.log(`✓ Risk Source ${source.title} berhasil dibuat`);
  }
}

async function seedTRisks() {
  console.log('🌱 Seeding t_risks...');

  const csvPath = path.join(__dirname, 'data', 't_risk.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const risks = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as TRiskSeedData[];

  // Get the SMK Telkom Malang organization
  const organization = await prisma.organization.findFirst({
    where: {
      name: 'SMK Telkom Malang',
    },
  });

  if (!organization) {
    console.log('❌ Organization SMK Telkom Malang not found for risk seeding');
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

    // Look up asset by ID
    const asset = await prisma.asset.findUnique({
      where: {
        id: risk.assetId,
      },
    });

    if (!asset) {
      console.log(`⚠️  Asset with ID "${risk.assetId}" not found for risk ${risk.customRiskId}, skipping...`);
      continue;
    }

    // Look up risk category by title
    const riskCategory = await prisma.riskCategory.findFirst({
      where: {
        title: risk.category_title,
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
        assetId: asset.id,
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

async function main() {
  try {
    await seedTOrganizations();
    await seedTDepartments();
    await seedTUsers();
    await seedTContexts();
    await seedTCIAObjectives();
    await seedTServices();
    await seedTExternalStakeholders();
    await seedTRegulations();
    await seedTAssets();
    await seedTRiskCriteria();
    await seedTScaleStatuses();
    await seedTRiskCategories();
    await seedTRiskSources();
    await seedTRisks();
    console.log('✅ Test Seeding selesai');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
