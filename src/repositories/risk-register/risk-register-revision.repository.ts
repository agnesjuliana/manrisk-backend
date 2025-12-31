import prisma from '../../config/prisma';
import {
  type CreateRiskRegisterRevisionRequest,
  type UpdateRiskRegisterRevisionRequest,
  type RiskRegisterRevisionResponse,
  type TreatmentWithRiskRevisionResponse,
} from '../../models/risk-register';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

const revisionDetailSelect = {
  id: true,
  riskId: true,
  managerId: true,
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
  isApprovedByOwner: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  context: {
    select: {
      id: true,
      name: true,
    },
  },
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
  manager: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

export async function createRiskRegisterRevision(
  organizationId: string,
  data: CreateRiskRegisterRevisionRequest,
): Promise<RiskRegisterRevisionResponse> {
  // Validate and fetch risk with all data needed
  const risk = await prisma.riskRegister.findFirst({
    where: {
      id: data.riskId,
      organizationId,
    },
  });

  if (!risk) {
    throw new Error('Risk Register tidak ditemukan atau bukan milik organisasi ini');
  }

  const revision = await prisma.riskRegisterRevisionLog.create({
    data: {
      riskId: data.riskId,
      managerId: risk.ownerId, // Auto from risk owner
      contextId: risk.contextId,
      riskCategoryId: risk.riskCategoryId,
      riskSourceId: risk.riskSourceId,
      customRiskId: risk.customRiskId,
      vulnerability: risk.vulnerability,
      threat: risk.threat,
      identifiedRisk: risk.identifiedRisk,
      detail: risk.detail,
      isConfidentiality: risk.isConfidentiality,
      isIntegrity: risk.isIntegrity,
      isAvailability: risk.isAvailability,
      impactSeverity: data.impactSeverity,
      likelihoodOccurence: data.likelihoodOccurence,
      detection: data.detection,
      isApprovedByOwner: false,
    },
    select: revisionDetailSelect,
  });

  return revision as RiskRegisterRevisionResponse;
}

export async function getRiskRevisionsByOrganization(
  organizationId: string,
  page: number,
  perPage: number,
  search?: string,
): Promise<PaginatedResponse<TreatmentWithRiskRevisionResponse>> {
  const skip = calculateSkip(page, perPage);

  const whereCondition: any = {
    organizationId,
    isApprovedByTop: true, // Only show treatments approved by TOP_MANAGEMENT
  };

  // If search provided, search in treatment details and risk details
  if (search) {
    whereCondition.OR = [
      {
        risk: {
          identifiedRisk: { contains: search, mode: 'insensitive' },
        },
      },
      {
        risk: {
          customRiskId: { contains: search, mode: 'insensitive' },
        },
      },
      {
        detailedActionPlan: { contains: search, mode: 'insensitive' },
      },
    ];
  }

  const [data, totalData] = await Promise.all([
    prisma.treatment.findMany({
      where: whereCondition,
      select: {
        id: true,
        riskId: true,
        treatmentOpt: true,
        detailedActionPlan: true,
        startAction: true,
        endAction: true,
        isApprovedByTop: true,
        risk: {
          select: {
            id: true,
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
            revisionLogs: {
              select: revisionDetailSelect,
              orderBy: { createdAt: 'desc' },
              take: 1, // Get latest revision
            },
          },
        },
        relatedControls: {
          select: {
            control: {
              select: {
                id: true,
                code: true,
                title: true,
                category: true,
                description: true,
                isAnnex: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.treatment.count({
      where: whereCondition,
    }),
  ]);

  // Transform data to match response type
  const transformedData: TreatmentWithRiskRevisionResponse[] = data.map((treatment: any) => ({
    id: treatment.id,
    riskId: treatment.riskId,
    treatmentOpt: treatment.treatmentOpt,
    detailedActionPlan: treatment.detailedActionPlan,
    startAction: treatment.startAction,
    endAction: treatment.endAction,
    isApprovedByTop: treatment.isApprovedByTop,
    risk: {
      id: treatment.risk.id,
      customRiskId: treatment.risk.customRiskId,
      vulnerability: treatment.risk.vulnerability,
      threat: treatment.risk.threat,
      identifiedRisk: treatment.risk.identifiedRisk,
      detail: treatment.risk.detail,
      isConfidentiality: treatment.risk.isConfidentiality,
      isIntegrity: treatment.risk.isIntegrity,
      isAvailability: treatment.risk.isAvailability,
      impactSeverity: treatment.risk.impactSeverity,
      likelihoodOccurence: treatment.risk.likelihoodOccurence,
      detection: treatment.risk.detection,
      revisionLog: treatment.risk.revisionLogs[0] || null, // null if no revision
    },
    controls: treatment.relatedControls.map((tc: any) => tc.control),
  }));

  const totalPage = Math.ceil(totalData / perPage);

  return {
    data: transformedData,
    metadata: {
      page,
      per_page: perPage,
      total_data: totalData,
      total_page: totalPage,
    },
  };
}

export async function getRiskRevisionById(
  organizationId: string,
  id: string,
): Promise<RiskRegisterRevisionResponse> {
  const revision = await prisma.riskRegisterRevisionLog.findFirst({
    where: {
      id,
      risk: {
        organizationId,
      },
    },
    select: revisionDetailSelect,
  });

  return revision as RiskRegisterRevisionResponse;
}

export async function updateRiskRegisterRevision(
  organizationId: string,
  id: string,
  data: UpdateRiskRegisterRevisionRequest,
): Promise<RiskRegisterRevisionResponse> {
  // Get the revision first
  const revision = await prisma.riskRegisterRevisionLog.findFirst({
    where: {
      id,
      risk: {
        organizationId,
      },
    },
  });

  if (!revision) {
    throw new Error('Risk Revision tidak ditemukan');
  }

  const updatedRevision = await prisma.riskRegisterRevisionLog.update({
    where: { id },
    data: {
      impactSeverity: data.impactSeverity ?? revision.impactSeverity,
      likelihoodOccurence: data.likelihoodOccurence ?? revision.likelihoodOccurence,
      detection: data.detection ?? revision.detection,
      isApprovedByOwner: data.isApprovedByOwner ?? revision.isApprovedByOwner,
    },
    select: revisionDetailSelect,
  });

  return updatedRevision as RiskRegisterRevisionResponse;
}

export async function deleteRiskRegisterRevision(organizationId: string, id: string): Promise<void> {
  // Get the revision first
  const revision = await prisma.riskRegisterRevisionLog.findFirst({
    where: {
      id,
      risk: {
        organizationId,
      },
    },
  });

  if (!revision) {
    throw new Error('Risk Revision tidak ditemukan');
  }

  await prisma.riskRegisterRevisionLog.delete({
    where: { id },
  });
}
