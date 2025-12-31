import prisma from '../../config/prisma';
import { type AssetTaskItem, type AssetTaskResponse, type RiskTaskItem, type RiskTaskResponse, type TreatmentTaskItem, type TreatmentTaskResponse, type ControlTaskItem, type ControlTaskResponse, type SOATaskItem, type SOATaskResponse } from '../../models/task';

export async function getAssetTasks(
  organizationId: string,
  userId: string,
  userRole: string,
  departmentId?: string,
): Promise<AssetTaskResponse> {
  let assetTasks: AssetTaskItem[] = [];

  switch (userRole) {
    case 'RISK_OWNER': {
      // RISK_OWNER -> Assets dengan status REVISI yang dimiliki user di divisinya
      const assets = await prisma.asset.findMany({
        where: {
          organizationId,
          status: 'REVISI',
          owner: {
            departmentId,
          },
        },
        select: {
          id: true,
          name: true,
          location: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      // Map to AssetTaskItem with taskType
      assetTasks = assets.map((asset) => ({
        ...asset,
        taskType: 'REVISION' as const,
      }));
      break;
    }

    case 'RISK_MANAGER': {
      // RISK_MANAGER -> Assets MENUNGGU_PERSETUJUAN_RM + AssetApprovalTL DITOLAK
      const pendingRMApprovalAssets = await prisma.asset.findMany({
        where: {
          organizationId,
          status: 'MENUNGGU_PERSETUJUAN_RM',
        },
        select: {
          id: true,
          name: true,
          location: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      const rejectedByTLApprovals = await prisma.assetApprovalTL.findMany({
        where: {
          organizationId,
          status: 'DITOLAK',
        },
        select: {
          assets: {
            select: {
              asset: {
                select: {
                  id: true,
                  name: true,
                  location: true,
                  status: true,
                  createdAt: true,
                  updatedAt: true,
                  owner: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Map pending RM approval
      const pendingAssets = pendingRMApprovalAssets.map((asset) => ({
        ...asset,
        taskType: 'PENDING_RM_APPROVAL' as const,
      }));

      // Map rejected by TL
      const rejectedAssets = rejectedByTLApprovals.flatMap((approval) =>
        approval.assets.map((ata) => ({
          ...ata.asset,
          taskType: 'REJECTED_BY_TL' as const,
        })),
      );

      assetTasks = [...pendingAssets, ...rejectedAssets].toSorted(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      break;
    }

    case 'TOP_MANAGEMENT': {
      // TOP_MANAGEMENT -> Assets MENUNGGU_PERSETUJUAN_FINAL + AssetApprovalTL MENUNGGU_PERSETUJUAN_FINAL
      const pendingTopApprovalAssets = await prisma.asset.findMany({
        where: {
          organizationId,
          status: 'MENUNGGU_PERSETUJUAN_FINAL',
        },
        select: {
          id: true,
          name: true,
          location: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      const pendingTLApprovals = await prisma.assetApprovalTL.findMany({
        where: {
          organizationId,
          status: 'MENUNGGU_PERSETUJUAN_FINAL',
        },
        select: {
          assets: {
            select: {
              asset: {
                select: {
                  id: true,
                  name: true,
                  location: true,
                  status: true,
                  createdAt: true,
                  updatedAt: true,
                  owner: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Map pending approval
      const pendingAssets = pendingTopApprovalAssets.map((asset) => ({
        ...asset,
        taskType: 'PENDING_TL_APPROVAL' as const,
      }));

      // Map pending TL approval
      const pendingTLAssets = pendingTLApprovals.flatMap((approval) =>
        approval.assets.map((ata) => ({
          ...ata.asset,
          taskType: 'PENDING_TL_APPROVAL' as const,
        })),
      );

      assetTasks = [...pendingAssets, ...pendingTLAssets].toSorted(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      break;
    }

    default: {
      assetTasks = [];
    }
  }

  return {
    assetTasks,
    totalAssetTasks: assetTasks.length,
  };
}

export async function getRiskTasks(
  organizationId: string,
  userId: string,
  userRole: string,
  departmentId?: string,
): Promise<RiskTaskResponse> {
  let riskTasks: RiskTaskItem[] = [];

  switch (userRole) {
    case 'RISK_OWNER': {
      // RISK_OWNER -> Risk dengan status REVISI yang dimiliki user di divisinya
      const risks = await prisma.riskRegister.findMany({
        where: {
          organizationId,
          status: 'REVISI',
          owner: {
            departmentId,
          },
        },
        select: {
          id: true,
          customRiskId: true,
          identifiedRisk: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      riskTasks = risks.map((risk) => ({
        ...risk,
        taskType: 'REVISION' as const,
      }));
      break;
    }

    case 'RISK_MANAGER': {
      // RISK_MANAGER -> Risk MENUNGGU_PERSETUJUAN_RM + RiskApprovalTL DITOLAK
      const pendingRMApprovalRisks = await prisma.riskRegister.findMany({
        where: {
          organizationId,
          status: 'MENUNGGU_PERSETUJUAN_RM',
        },
        select: {
          id: true,
          customRiskId: true,
          identifiedRisk: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      const rejectedByTLApprovals = await prisma.riskApprovalTL.findMany({
        where: {
          organizationId,
          status: 'DITOLAK',
        },
        select: {
          risks: {
            select: {
              risk: {
                select: {
                  id: true,
                  customRiskId: true,
                  identifiedRisk: true,
                  status: true,
                  createdAt: true,
                  updatedAt: true,
                  owner: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                  category: {
                    select: {
                      id: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const pendingRisks = pendingRMApprovalRisks.map((risk) => ({
        ...risk,
        taskType: 'PENDING_RM_APPROVAL' as const,
      }));

      const rejectedRisks = rejectedByTLApprovals.flatMap((approval) =>
        approval.risks.map((rat) => ({
          ...rat.risk,
          taskType: 'REJECTED_BY_TL' as const,
        })),
      );

      riskTasks = [...pendingRisks, ...rejectedRisks].toSorted(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      break;
    }

    case 'TOP_MANAGEMENT': {
      // TOP_MANAGEMENT -> Risk MENUNGGU_PERSETUJUAN_FINAL + RiskApprovalTL MENUNGGU_PERSETUJUAN_FINAL
      const pendingTopApprovalRisks = await prisma.riskRegister.findMany({
        where: {
          organizationId,
          status: 'MENUNGGU_PERSETUJUAN_FINAL',
        },
        select: {
          id: true,
          customRiskId: true,
          identifiedRisk: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      const pendingTLApprovals = await prisma.riskApprovalTL.findMany({
        where: {
          organizationId,
          status: 'MENUNGGU_PERSETUJUAN_FINAL',
        },
        select: {
          risks: {
            select: {
              risk: {
                select: {
                  id: true,
                  customRiskId: true,
                  identifiedRisk: true,
                  status: true,
                  createdAt: true,
                  updatedAt: true,
                  owner: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                  category: {
                    select: {
                      id: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const pendingRisks = pendingTopApprovalRisks.map((risk) => ({
        ...risk,
        taskType: 'PENDING_TL_APPROVAL' as const,
      }));

      const pendingTLRisks = pendingTLApprovals.flatMap((approval) =>
        approval.risks.map((rat) => ({
          ...rat.risk,
          taskType: 'PENDING_TL_APPROVAL' as const,
        })),
      );

      riskTasks = [...pendingRisks, ...pendingTLRisks].toSorted(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      break;
    }

    default: {
      riskTasks = [];
    }
  }

  return {
    riskTasks,
    totalRiskTasks: riskTasks.length,
  };
}

export async function getTreatmentTasks(
  organizationId: string,
  userId: string,
  userRole: string,
): Promise<TreatmentTaskResponse> {
  let treatmentTasks: TreatmentTaskItem[] = [];

  switch (userRole) {
    case 'TOP_MANAGEMENT': {
      // TOP_MANAGEMENT -> Treatments that need approval (isApprovedByTop = false/null)
      const treatmentsNeedingApproval = await prisma.treatment.findMany({
        where: {
          organizationId,
          isApprovedByTop: false,
        },
        select: {
          id: true,
          riskId: true,
          treatmentOpt: true,
          isApprovedByTop: true,
          createdAt: true,
          updatedAt: true,
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          pic: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          risk: {
            select: {
              id: true,
              customRiskId: true,
              identifiedRisk: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      treatmentTasks = treatmentsNeedingApproval.map((treatment) => ({
        id: treatment.id,
        riskId: treatment.riskId,
        customRiskId: treatment.risk.customRiskId,
        identifiedRisk: treatment.risk.identifiedRisk,
        treatmentOpt: treatment.treatmentOpt,
        taskType: 'PENDING_APPROVAL' as const,
        manager: treatment.manager,
        pic: treatment.pic,
        createdAt: treatment.createdAt,
        updatedAt: treatment.updatedAt,
      }));
      break;
    }

    case 'RISK_MANAGER': {
      // RISK_MANAGER -> Show risks that meet treatment criteria (score >= threshold, status = DISETUJUI, no treatment yet)
      // Get risk criteria for this organization
      const riskCriteria = await prisma.riskCriteria.findFirst({
        where: {
          organizationId,
        },
      });

      if (riskCriteria) {
        const risksNeedingTreatment = await prisma.riskRegister.findMany({
          where: {
            organizationId,
            status: 'DISETUJUI',
            deletedAt: null,
            treatments: {
              none: {},
            },
          },
          select: {
            id: true,
            customRiskId: true,
            identifiedRisk: true,
            impactSeverity: true,
            likelihoodOccurence: true,
            detection: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        // Filter by risk criteria threshold
        const tasksAboveThreshold = risksNeedingTreatment
          .map((risk) => {
            const score: number = riskCriteria.isFMEA
              ? (risk.impactSeverity || 0) *
                (risk.likelihoodOccurence || 0) *
                (risk.detection || 0)
              : (risk.impactSeverity || 0) * (risk.likelihoodOccurence || 0);

            return { risk, score };
          })
          .filter((item) => item.score >= riskCriteria.threshold)
          .toSorted((a, b) => b.score - a.score);

        treatmentTasks = tasksAboveThreshold.map((item) => ({
          id: item.risk.id,
          riskId: item.risk.id,
          customRiskId: item.risk.customRiskId,
          identifiedRisk: item.risk.identifiedRisk,
          treatmentOpt: 'PENDING',
          taskType: 'NEEDS_TREATMENT' as const,
          manager: item.risk.owner,
          createdAt: new Date(),
        }));
      }

      break;
    }

    case 'RISK_OWNER': {
      // RISK_OWNER -> Treatments where they are assigned as PIC
      const assignedTreatments = await prisma.treatment.findMany({
        where: {
          organizationId,
          picId: userId,
        },
        select: {
          id: true,
          riskId: true,
          treatmentOpt: true,
          createdAt: true,
          updatedAt: true,
          manager: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          pic: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          risk: {
            select: {
              id: true,
              customRiskId: true,
              identifiedRisk: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      treatmentTasks = assignedTreatments.map((treatment) => ({
        id: treatment.id,
        riskId: treatment.riskId,
        customRiskId: treatment.risk.customRiskId,
        identifiedRisk: treatment.risk.identifiedRisk,
        treatmentOpt: treatment.treatmentOpt,
        taskType: 'PENDING_APPROVAL' as const,
        manager: treatment.manager,
        pic: treatment.pic,
        createdAt: treatment.createdAt,
        updatedAt: treatment.updatedAt,
      }));
      break;
    }

    default: {
      treatmentTasks = [];
    }
  }

  return {
    treatmentTasks,
    totalTreatmentTasks: treatmentTasks.length,
  };
}

export function getControlTasks(): Promise<ControlTaskResponse> {
  // Get all controls (global and organization-specific)
  // Note: Control doesn't have PIC field, so user won't get notifications for controls
  // This endpoint returns empty array to maintain consistency
  const controlTasks: ControlTaskItem[] = [];

  return Promise.resolve({
    controlTasks,
    totalControlTasks: controlTasks.length,
  });
}

export async function getSOATasks(
  organizationId: string,
  userId: string,
): Promise<SOATaskResponse> {
  // Get SOA tasks where user is assigned as manager (PIC)
  const soaTasks = await prisma.sOA.findMany({
    where: {
      organizationId,
      managerId: userId,
    },
    select: {
      id: true,
      controlId: true,
      status: true,
      implementationStatus: true,
      targetDate: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      control: {
        select: {
          code: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate statusTarget for each SOA
  const now = new Date();
  const mappedTasks: SOATaskItem[] = soaTasks.map((soa) => {
    const statusTarget: 'ON_TRACK' | 'OVERDUE' | undefined =
      soa.targetDate && new Date(soa.targetDate) < now && soa.implementationStatus !== 'DIIMPLEMENTASIKAN'
        ? 'OVERDUE'
        : 'ON_TRACK';

    return {
      id: soa.id,
      controlId: soa.controlId,
      controlCode: soa.control.code,
      controlTitle: soa.control.title,
      status: soa.status,
      implementationStatus: soa.implementationStatus,
      statusTarget,
      targetDate: soa.targetDate,
      notes: soa.notes,
      createdAt: soa.createdAt,
      updatedAt: soa.updatedAt,
    };
  });

  return {
    soaTasks: mappedTasks,
    totalSOATasks: mappedTasks.length,
  };
}