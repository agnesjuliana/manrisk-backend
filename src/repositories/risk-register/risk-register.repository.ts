import prisma from '../../config/prisma';
import {
  type CreateRiskRegisterRequest,
  type UpdateRiskRegisterRequest,
  type RiskRegisterResponse,
} from '../../models/risk-register';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

const riskRegisterSelect = {
  id: true,
  organizationId: true,
  ownerId: true,
  assetId: true,
  contextId: true,
  riskCategoryId: true,
  riskSourceId: true,
  customRiskId: true,
  vulnerability: true,
  threat: true,
  identifiedRisk: true,
  detail: true,
  isConfidentiality: true,
  isIntegrity: true,
  isAvailability: true,
  impactSeverity: true,
  likelihoodOccurence: true,
  detection: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  category: {
    select: {
      id: true,
      title: true,
    },
  },
  source: {
    select: {
      id: true,
      title: true,
    },
  },
  asset: {
    select: {
      id: true,
      name: true,
    },
  },
  context: {
    select: {
      id: true,
      name: true,
    },
  },
  owner: {
    select: {
      id: true,
      name: true,
    },
  },
};

export async function createRiskRegister(
  organizationId: string,
  userId: string,
  data: CreateRiskRegisterRequest,
): Promise<RiskRegisterResponse> {
  // Handle category - check if exists or create if not
  let categoryId = data.riskcategory.id;

  if (!categoryId) {
    // Check if category with same title exists in org or in public (null organizationId)
    const existingCategory = await prisma.riskCategory.findFirst({
      where: {
        title: data.riskcategory.name,
        OR: [
          { organizationId },
          { organizationId: null },
        ],
      },
    });

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const newCategory = await prisma.riskCategory.create({
        data: {
          title: data.riskcategory.name,
          organizationId,
        },
      });
      categoryId = newCategory.id;
    }
  }

  // Handle source - check if exists or create if not
  let sourceId = data.source.id;

  if (!sourceId) {
    // Check if source with same title exists in org or in public (null organizationId)
    const existingSource = await prisma.riskSource.findFirst({
      where: {
        title: data.source.name,
        OR: [
          { organizationId },
          { organizationId: null },
        ],
      },
    });

    if (existingSource) {
      sourceId = existingSource.id;
    } else {
      const newSource = await prisma.riskSource.create({
        data: {
          title: data.source.name,
          organizationId,
        },
      });
      sourceId = newSource.id;
    }
  }

  // Validate asset if provided
  if (data.assetId) {
    const asset = await prisma.asset.findFirst({
      where: {
        id: data.assetId,
        organizationId,
      },
    });

    if (!asset) {
      throw new Error('Asset tidak ditemukan atau tidak milik organisasi ini');
    }
  }

  // Validate context if provided
  if (data.contextId) {
    const context = await prisma.context.findFirst({
      where: {
        id: data.contextId,
        organizationId,
      },
    });

    if (!context) {
      throw new Error('Context tidak ditemukan atau tidak milik organisasi ini');
    }
  }

  const riskRegister = await prisma.riskRegister.create({
    data: {
      organizationId,
      ownerId: userId,
      assetId: data.assetId || null,
      contextId: data.contextId || null,
      riskCategoryId: categoryId,
      riskSourceId: sourceId,
      customRiskId: data.customRiskId,
      vulnerability: data.vulnerability,
      threat: data.threat,
      identifiedRisk: data.identifiedRisk,
      detail: data.detail || null,
      isConfidentiality: data.isConfidentiality ?? false,
      isIntegrity: data.isIntegrity ?? false,
      isAvailability: data.isAvailability ?? false,
      impactSeverity: data.impactSeverity ?? null,
      likelihoodOccurence: data.likelihoodOccurence ?? null,
      detection: data.detection ?? null,
      status: 'DRAFT',
    },
    select: riskRegisterSelect,
  });

  return mapRiskRegisterResponse(riskRegister);
}

export async function getRiskRegisters(
  organizationId: string,
  page: number,
  perPage: number,
  role?: string,
  departmentId?: string,
  status?: string[],
  search?: string,
): Promise<PaginatedResponse<RiskRegisterResponse>> {
  const skip = calculateSkip(page, perPage);

  // Build where clause for filtering
  const whereClause: any = {
    organizationId,
  };

  // If user is RISK_OWNER, filter by their department's owner
  if (role === 'RISK_OWNER' && departmentId) {
    whereClause.owner = {
      departmentId,
    };
  }

  // Add status filter if provided
  if (status && status.length > 0) {
    whereClause.status = {
      in: status,
    };
  }

  // Add search filter if provided - search in customRiskId and identifiedRisk
  if (search) {
    whereClause.OR = [
      {
        customRiskId: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        identifiedRisk: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  const [data, totalData] = await Promise.all([
    prisma.riskRegister.findMany({
      where: whereClause,
      select: riskRegisterSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.riskRegister.count({
      where: whereClause,
    }),
  ]);

  const totalPage = Math.ceil(totalData / perPage);

  return {
    data: data.map(item => mapRiskRegisterResponse(item)),
    metadata: {
      page,
      per_page: perPage,
      total_data: totalData,
      total_page: totalPage,
    },
  };
}

export async function getRiskRegisterById(
  organizationId: string,
  id: string,
): Promise<RiskRegisterResponse | null> {
  const riskRegister = await prisma.riskRegister.findFirst({
    where: {
      id,
      organizationId,
    },
    select: riskRegisterSelect,
  });

  if (!riskRegister) {
    return null;
  }

  return mapRiskRegisterResponse(riskRegister);
}

export async function updateRiskRegister(
  organizationId: string,
  id: string,
  data: UpdateRiskRegisterRequest,
): Promise<RiskRegisterResponse> {
  // Handle category if provided
  let categoryId: string | undefined;

  if (data.riskcategory) {
    if (data.riskcategory.id) {
      categoryId = data.riskcategory.id;
    } else {
      // Check if category with same title exists in org or in public (null organizationId)
      const existingCategory = await prisma.riskCategory.findFirst({
        where: {
          title: data.riskcategory.name,
          OR: [
            { organizationId },
            { organizationId: null },
          ],
        },
      });

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const newCategory = await prisma.riskCategory.create({
          data: {
            title: data.riskcategory.name,
            organizationId,
          },
        });
        categoryId = newCategory.id;
      }
    }
  }

  // Handle source if provided
  let sourceId: string | undefined;

  if (data.source) {
    if (data.source.id) {
      sourceId = data.source.id;
    } else {
      // Check if source with same title exists in org or in public (null organizationId)
      const existingSource = await prisma.riskSource.findFirst({
        where: {
          title: data.source.name,
          OR: [
            { organizationId },
            { organizationId: null },
          ],
        },
      });

      if (existingSource) {
        sourceId = existingSource.id;
      } else {
        const newSource = await prisma.riskSource.create({
          data: {
            title: data.source.name,
            organizationId,
          },
        });
        sourceId = newSource.id;
      }
    }
  }

  // Validate asset if provided
  if (data.assetId) {
    const asset = await prisma.asset.findFirst({
      where: {
        id: data.assetId,
        organizationId,
      },
    });

    if (!asset) {
      throw new Error('Asset tidak ditemukan atau tidak milik organisasi ini');
    }
  }

  // Validate context if provided
  if (data.contextId) {
    const context = await prisma.context.findFirst({
      where: {
        id: data.contextId,
        organizationId,
      },
    });

    if (!context) {
      throw new Error('Context tidak ditemukan atau tidak milik organisasi ini');
    }
  }

  const updateData: any = {};
  if (data.assetId !== undefined) updateData.assetId = data.assetId || null;
  if (data.contextId !== undefined) updateData.contextId = data.contextId || null;
  if (categoryId !== undefined) updateData.riskCategoryId = categoryId;
  if (sourceId !== undefined) updateData.riskSourceId = sourceId || null;
  if (data.customRiskId !== undefined) updateData.customRiskId = data.customRiskId;
  if (data.vulnerability !== undefined) updateData.vulnerability = data.vulnerability;
  if (data.threat !== undefined) updateData.threat = data.threat;
  if (data.identifiedRisk !== undefined) updateData.identifiedRisk = data.identifiedRisk;
  if (data.detail !== undefined) updateData.detail = data.detail || null;
  if (data.isConfidentiality !== undefined) updateData.isConfidentiality = data.isConfidentiality;
  if (data.isIntegrity !== undefined) updateData.isIntegrity = data.isIntegrity;
  if (data.isAvailability !== undefined) updateData.isAvailability = data.isAvailability;
  if (data.impactSeverity !== undefined) updateData.impactSeverity = data.impactSeverity || null;
  if (data.likelihoodOccurence !== undefined)
    updateData.likelihoodOccurence = data.likelihoodOccurence || null;
  if (data.detection !== undefined) updateData.detection = data.detection || null;
  if (data.ownerId !== undefined) updateData.ownerId = data.ownerId;
  if (data.status !== undefined) updateData.status = data.status;

  const riskRegister = await prisma.riskRegister.update({
    where: { id },
    data: updateData,
    select: riskRegisterSelect,
  });

  return mapRiskRegisterResponse(riskRegister);
}

export async function deleteRiskRegister(organizationId: string, id: string): Promise<void> {
  await prisma.riskRegister.delete({
    where: { id },
  });
}

// Helper function to map response
function mapRiskRegisterResponse(data: any): RiskRegisterResponse {
  return {
    id: data.id,
    organizationId: data.organizationId,
    ownerId: data.ownerId,
    assetId: data.assetId,
    contextId: data.contextId,
    riskCategoryId: data.riskCategoryId,
    riskSourceId: data.riskSourceId,
    customRiskId: data.customRiskId,
    vulnerability: data.vulnerability,
    threat: data.threat,
    identifiedRisk: data.identifiedRisk,
    detail: data.detail,
    isConfidentiality: data.isConfidentiality,
    isIntegrity: data.isIntegrity,
    isAvailability: data.isAvailability,
    impactSeverity: data.impactSeverity,
    likelihoodOccurence: data.likelihoodOccurence,
    detection: data.detection,
    status: data.status,
    category: data.category,
    source: data.source,
    asset: data.asset,
    context: data.context,
    owner: data.owner,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  };
}
