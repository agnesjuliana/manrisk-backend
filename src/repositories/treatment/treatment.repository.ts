import prisma from '../../config/prisma';
import {
  type CreateTreatmentRequest,
  type TreatmentResponse,
  type TreatmentWithRiskResponse,
  type UpdateTreatmentRequest,
} from '../../models/treatment';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

const treatmentDetailSelect = {
  id: true,
  riskId: true,
  managerId: true,
  picId: true,
  organizationId: true,
  treatmentOpt: true,
  impactSeverityTarget: true,
  likelihoodOccurenceTarget: true,
  detectionTarget: true,
  actionReason: true,
  detailedActionPlan: true,
  startAction: true,
  endAction: true,
  notes: true,
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
      impactSeverity: true,
      likelihoodOccurence: true,
      detection: true,
    },
  },
  relatedControls: {
    include: {
      control: {
        select: {
          id: true,
          code: true,
          title: true,
        },
      },
    },
  },
};

function mapTreatmentResponse(treatment: any): TreatmentResponse {
  return {
    id: treatment.id,
    riskId: treatment.riskId,
    managerId: treatment.managerId,
    picId: treatment.picId,
    organizationId: treatment.organizationId,
    treatmentOpt: treatment.treatmentOpt,
    impactSeverityTarget: treatment.impactSeverityTarget,
    likelihoodOccurenceTarget: treatment.likelihoodOccurenceTarget,
    detectionTarget: treatment.detectionTarget,
    actionReason: treatment.actionReason,
    detailedActionPlan: treatment.detailedActionPlan,
    startAction: treatment.startAction,
    endAction: treatment.endAction,
    notes: treatment.notes,
    isApprovedByTop: treatment.isApprovedByTop,
    createdAt: treatment.createdAt,
    updatedAt: treatment.updatedAt,
    manager: treatment.manager,
    pic: treatment.pic,
    risk: treatment.risk,
    relatedControls: treatment.relatedControls.map((tc: any) => tc.control),
  };
}

function validateControls(controlIds: string[]): Promise<any> {
  return prisma.control.findMany({
    where: {
      id: {
        in: controlIds,
      },
    },
  });
}

export async function createTreatment(
  organizationId: string,
  managerId: string,
  data: CreateTreatmentRequest,
): Promise<TreatmentResponse> {
  // Validate that risk exists and belongs to organization
  const risk = await prisma.riskRegister.findFirst({
    where: {
      id: data.riskId,
      organizationId,
    },
  });

  if (!risk) {
    throw new Error(`Risk dengan ID ${data.riskId} tidak ditemukan di organisasi ini`);
  }

  // Check if treatment already exists for this risk
  const existingTreatment = await prisma.treatment.findFirst({
    where: {
      riskId: data.riskId,
    },
  });

  if (existingTreatment) {
    throw new Error('Treatment untuk risk ini sudah ada');
  }

  // Validate that pic user exists and belongs to organization
  const pic = await prisma.user.findFirst({
    where: {
      id: data.picId,
      organizationId,
    },
  });

  if (!pic) {
    throw new Error(`PIC dengan ID ${data.picId} tidak ditemukan di organisasi ini`);
  }

  // Validate that all controls exist
  const controlsExist = await validateControls(data.controlIds);

  if (controlsExist.length !== data.controlIds.length) {
    throw new Error('Satu atau lebih control ID tidak valid');
  }

  // Create treatment with controls
  const treatment = await prisma.treatment.create({
    data: {
      organizationId,
      riskId: data.riskId,
      managerId,
      picId: data.picId,
      treatmentOpt: data.treatmentOpt,
      impactSeverityTarget: data.impactSeverityTarget || null,
      likelihoodOccurenceTarget: data.likelihoodOccurenceTarget || null,
      detectionTarget: data.detectionTarget || null,
      actionReason: data.actionReason || null,
      detailedActionPlan: data.detailedActionPlan,
      startAction: new Date(data.startAction),
      endAction: new Date(data.endAction),
      notes: data.notes || null,
      relatedControls: {
        create: data.controlIds.map((controlId) => ({
          controlId,
        })),
      },
    },
    select: treatmentDetailSelect,
  });

  return mapTreatmentResponse(treatment);
}

export async function updateTreatment(
  organizationId: string,
  treatmentId: string,
  data: UpdateTreatmentRequest,
): Promise<TreatmentResponse> {
  // Validate treatment exists and belongs to organization
  const treatment = await prisma.treatment.findFirst({
    where: {
      id: treatmentId,
      organizationId,
    },
  });

  if (!treatment) {
    throw new Error('Treatment tidak ditemukan');
  }

  // If pic is being updated, validate it exists
  if (data.picId) {
    const pic = await prisma.user.findFirst({
      where: {
        id: data.picId,
        organizationId,
      },
    });

    if (!pic) {
      throw new Error(`PIC dengan ID ${data.picId} tidak ditemukan di organisasi ini`);
    }
  }

  // If controls are being updated, validate and update them
  if (data.controlIds && data.controlIds.length > 0) {
    const controlsExist = await validateControls(data.controlIds);

    if (controlsExist.length !== data.controlIds.length) {
      throw new Error('Satu atau lebih control ID tidak valid');
    }

    // Delete existing treatment controls
    await prisma.treatmentControl.deleteMany({
      where: {
        treatmentId,
      },
    });

    // Create new treatment controls
    await prisma.treatmentControl.createMany({
      data: data.controlIds.map((controlId) => ({
        treatmentId,
        controlId,
      })),
    });
  }

  // Prepare update data
  const updateData: any = {};
  if (data.picId) updateData.picId = data.picId;
  if (data.treatmentOpt) updateData.treatmentOpt = data.treatmentOpt;
  if (data.impactSeverityTarget !== undefined) updateData.impactSeverityTarget = data.impactSeverityTarget;
  if (data.likelihoodOccurenceTarget !== undefined) updateData.likelihoodOccurenceTarget = data.likelihoodOccurenceTarget;
  if (data.detectionTarget !== undefined) updateData.detectionTarget = data.detectionTarget;
  if (data.actionReason !== undefined) updateData.actionReason = data.actionReason;
  if (data.detailedActionPlan) updateData.detailedActionPlan = data.detailedActionPlan;
  if (data.startAction) updateData.startAction = new Date(data.startAction);
  if (data.endAction) updateData.endAction = new Date(data.endAction);
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.isApprovedByTop !== undefined) updateData.isApprovedByTop = data.isApprovedByTop;

  const updated = await prisma.treatment.update({
    where: {
      id: treatmentId,
    },
    data: updateData,
    select: treatmentDetailSelect,
  });

  return mapTreatmentResponse(updated);
}

export async function deleteTreatment(organizationId: string, treatmentId: string): Promise<void> {
  const treatment = await prisma.treatment.findFirst({
    where: {
      id: treatmentId,
      organizationId,
    },
  });

  if (!treatment) {
    throw new Error('Treatment tidak ditemukan');
  }

  await prisma.treatment.delete({
    where: {
      id: treatmentId,
    },
  });
}

export async function getTreatments(
  organizationId: string,
  page: number = 1,
  perPage: number = 10,
): Promise<PaginatedResponse<TreatmentWithRiskResponse>> {
  // Get risk criteria for this organization
  const riskCriteria = await prisma.riskCriteria.findFirst({
    where: {
      organizationId,
    },
  });

  if (!riskCriteria) {
    throw new Error('Risk criteria belum dikonfigurasi untuk organisasi ini');
  }

  // Get all risks for this organization with their current treatments
  const risks = await prisma.riskRegister.findMany({
    where: {
      organizationId,
      deletedAt: null,
    },
    include: {
      treatments: {
        include: {
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
          relatedControls: {
            include: {
              control: {
                select: {
                  id: true,
                  code: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Calculate scores and filter based on FMEA
  let risksWithScores = risks.map((risk) => {
    const score: number = riskCriteria.isFMEA
      ? (risk.impactSeverity || 0) * (risk.likelihoodOccurence || 0) * (risk.detection || 0)
      : (risk.impactSeverity || 0) * (risk.likelihoodOccurence || 0);

    return {
      risk,
      score,
    };
  });

  // Filter risks that meet or exceed threshold
  risksWithScores = risksWithScores.filter((item) => item.score >= riskCriteria.threshold);

  // Sort by score descending
  risksWithScores.sort((a, b) => b.score - a.score);

  // Apply pagination
  const total = risksWithScores.length;
  const skip = calculateSkip(page, perPage);
  const paginatedRisks = risksWithScores.slice(skip, skip + perPage);

  // Map to response format
  const data: TreatmentWithRiskResponse[] = paginatedRisks.map((item) => ({
    risk: {
      id: item.risk.id,
      customRiskId: item.risk.customRiskId,
      identifiedRisk: item.risk.identifiedRisk,
      vulnerability: item.risk.vulnerability,
      threat: item.risk.threat,
      impactSeverity: item.risk.impactSeverity,
      likelihoodOccurence: item.risk.likelihoodOccurence,
      detection: item.risk.detection,
      impactSeverityTarget: item.risk.treatments[0]?.impactSeverityTarget,
      likelihoodOccurenceTarget: item.risk.treatments[0]?.likelihoodOccurenceTarget,
      detectionTarget: item.risk.treatments[0]?.detectionTarget,
    },
    treatment: item.risk.treatments.length > 0 ? mapTreatmentResponse(item.risk.treatments[0]) : null,
    score: item.score,
  }));

  return {
    data,
    metadata: {
      page,
      per_page: perPage,
      total_data: total,
      total_page: Math.ceil(total / perPage),
    },
  };
}

export async function getTreatmentById(
  organizationId: string,
  treatmentId: string,
): Promise<TreatmentResponse | null> {
  const treatment = await prisma.treatment.findFirst({
    where: {
      id: treatmentId,
      organizationId,
    },
    select: treatmentDetailSelect,
  });

  if (!treatment) {
    return null;
  }

  return mapTreatmentResponse(treatment);
}
