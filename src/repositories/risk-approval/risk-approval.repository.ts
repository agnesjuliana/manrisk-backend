import prisma from '../../config/prisma';
import {
  type CreateRiskApprovalRequest,
  type UpdateRiskApprovalRequest,
  type RiskApprovalResponse,
} from '../../models/risk-approval';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

const riskApprovalSelect = {
  id: true,
  organizationId: true,
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  manager: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  risks: {
    select: {
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
          owner: {
            select: {
              id: true,
              name: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
};

export async function createRiskApproval(
  organizationId: string,
  managerId: string,
  data: CreateRiskApprovalRequest,
): Promise<RiskApprovalResponse> {
  // Validate that all risks exist and have status DISETUJUI_RM
  const risks = await prisma.riskRegister.findMany({
    where: {
      id: {
        in: data.riskIds,
      },
      organizationId,
    },
  });

  if (risks.length !== data.riskIds.length) {
    throw new Error('Beberapa Risk Register tidak ditemukan atau tidak milik organisasi ini');
  }

  const allDiSetujuiRM = risks.every(risk => risk.status === 'DISETUJUI_RM');

  if (!allDiSetujuiRM) {
    throw new Error('Semua Risk Register harus memiliki status DISETUJUI_RM');
  }

  // Create approval with status MENUNGGU_PERSETUJUAN_FINAL
  const riskApproval = await prisma.riskApprovalTL.create({
    data: {
      organizationId,
      managerId,
      message: data.message || null,
      status: 'MENUNGGU_PERSETUJUAN_FINAL',
      risks: {
        create: data.riskIds.map(riskId => ({
          riskId,
        })),
      },
    },
    select: riskApprovalSelect,
  });

  // Update all risks to MENUNGGU_PERSETUJUAN_FINAL
  await prisma.riskRegister.updateMany({
    where: {
      id: {
        in: data.riskIds,
      },
    },
    data: {
      status: 'MENUNGGU_PERSETUJUAN_FINAL',
    },
  });

  return mapRiskApprovalResponse(riskApproval);
}

export async function getRiskApprovals(
  organizationId: string,
  page: number,
  perPage: number,
): Promise<PaginatedResponse<RiskApprovalResponse>> {
  const skip = calculateSkip(page, perPage);

  const [data, totalData] = await Promise.all([
    prisma.riskApprovalTL.findMany({
      where: { organizationId },
      select: riskApprovalSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.riskApprovalTL.count({
      where: { organizationId },
    }),
  ]);

  const totalPage = Math.ceil(totalData / perPage);

  return {
    data: data.map(item => mapRiskApprovalResponse(item)),
    metadata: {
      page,
      per_page: perPage,
      total_data: totalData,
      total_page: totalPage,
    },
  };
}

export async function getRiskApprovalById(
  organizationId: string,
  id: string,
): Promise<RiskApprovalResponse | null> {
  const riskApproval = await prisma.riskApprovalTL.findFirst({
    where: {
      id,
      organizationId,
    },
    select: riskApprovalSelect,
  });

  if (!riskApproval) {
    return null;
  }

  return mapRiskApprovalResponse(riskApproval);
}

export async function updateRiskApproval(
  organizationId: string,
  id: string,
  data: UpdateRiskApprovalRequest,
): Promise<RiskApprovalResponse> {
  const riskApproval = await prisma.riskApprovalTL.findFirst({
    where: {
      id,
      organizationId,
    },
    include: {
      risks: true,
    },
  });

  if (!riskApproval) {
    throw new Error('Risk Approval tidak ditemukan');
  }

  // Get all risk IDs for this approval
  const riskIds = riskApproval.risks.map(r => r.riskId);

  // Update approval status
  const updatedApproval = await prisma.riskApprovalTL.update({
    where: { id },
    data: {
      status: data.status as any,
    },
    select: riskApprovalSelect,
  });

  // Update all related risks based on approval status
  if (data.status === 'DISETUJUI') {
    // Update all risks to DISETUJUI
    await prisma.riskRegister.updateMany({
      where: {
        id: {
          in: riskIds,
        },
      },
      data: {
        status: 'DISETUJUI',
      },
    });
  } else if (data.status === 'DITOLAK') {
    // Update all risks to REVISI
    await prisma.riskRegister.updateMany({
      where: {
        id: {
          in: riskIds,
        },
      },
      data: {
        status: 'REVISI',
      },
    });
  }

  return mapRiskApprovalResponse(updatedApproval);
}

export async function deleteRiskApproval(organizationId: string, id: string): Promise<void> {
  const riskApproval = await prisma.riskApprovalTL.findFirst({
    where: {
      id,
      organizationId,
    },
    include: {
      risks: true,
    },
  });

  if (!riskApproval) {
    throw new Error('Risk Approval tidak ditemukan');
  }

  // Get all risk IDs
  const riskIds = riskApproval.risks.map(r => r.riskId);

  // Revert all risks to DISETUJUI_RM before deleting approval
  await prisma.riskRegister.updateMany({
    where: {
      id: {
        in: riskIds,
      },
    },
    data: {
      status: 'DISETUJUI_RM',
    },
  });

  // Delete the approval
  await prisma.riskApprovalTL.delete({
    where: { id },
  });
}

// Helper function to map response
function mapRiskApprovalResponse(data: any): RiskApprovalResponse {
  return {
    id: data.id,
    organizationId: data.organizationId,
    manager: data.manager,
    message: data.message,
    status: data.status,
    risks: data.risks.map((item: any) => ({
      id: item.risk.id,
      customRiskId: item.risk.customRiskId,
      vulnerability: item.risk.vulnerability,
      threat: item.risk.threat,
      identifiedRisk: item.risk.identifiedRisk,
      detail: item.risk.detail,
      isConfidentiality: item.risk.isConfidentiality,
      isIntegrity: item.risk.isIntegrity,
      isAvailability: item.risk.isAvailability,
      impactSeverity: item.risk.impactSeverity,
      likelihoodOccurence: item.risk.likelihoodOccurence,
      detection: item.risk.detection,
      status: item.risk.status,
      category: item.risk.category,
      source: item.risk.source,
      owner: item.risk.owner,
    })),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  };
}
