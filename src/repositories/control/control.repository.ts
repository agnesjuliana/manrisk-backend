import prisma from '../../config/prisma';
import {
  type CreateControlRequest,
  type UpdateControlRequest,
  type ControlResponse,
  type ControlDetailResponse,
  type ControlStatisticsResponse,
  type ControlOptionResponse,
} from '../../models/control';

export async function createControl(
  organizationId: string,
  data: CreateControlRequest,
): Promise<ControlResponse> {
  // Check if control with same code already exists for this organization or global
  const existingControl = await prisma.control.findFirst({
    where: {
      code: data.code,
      OR: [{ organizationId }, { organizationId: null }],
    },
  });

  if (existingControl) {
    throw new Error('Control dengan code yang sama sudah ada');
  }

  const control = await prisma.control.create({
    data: {
      code: data.code,
      category: data.category || null,
      title: data.title,
      description: data.description || null,
      isAnnex: data.isAnnex ?? false,
      organizationId,
    },
  });

  return control;
}

export async function getControls(
  organizationId: string,
  search?: string,
  isAnnex?: boolean,
): Promise<ControlResponse[]> {
  const whereConditions: any = {
    AND: [
      {
        OR: [{ organizationId }, { organizationId: null }],
      },
    ],
  };

  // Add search filter
  if (search) {
    whereConditions.AND.push({
      OR: [
        { code: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  // Add isAnnex filter
  if (isAnnex !== undefined) {
    whereConditions.AND.push({ isAnnex });
  }

  const data = await prisma.control.findMany({
    where: whereConditions,
    orderBy: { createdAt: 'desc' },
    include: {
      soas: {
        where: { organizationId }, // Only include SOA for user's organization
        select: {
          id: true,
          organizationId: true,
          controlId: true,
          managerId: true,
          status: true,
          notes: true,
          targetDate: true,
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
        },
      },
    },
  });

  // Get treatment counts for each control (filtered by user's organization)
  const treatmentCounts = await prisma.treatmentControl.groupBy({
    by: ['controlId'],
    _count: {
      controlId: true,
    },
    where: {
      treatment: {
        organizationId, // Only count treatments from user's organization
      },
    },
  });

  // Create a map for quick lookup
  const countMap = new Map(treatmentCounts.map((item) => [item.controlId, item._count.controlId]));

  // Enrich data with treatment counts and SOA record
  const enrichedData = data.map((control) => {
    const { soas, ...controlWithoutSoas } = control;

    return {
      ...controlWithoutSoas,
      countRelatedTreatment: countMap.get(control.id) || 0,
      soa: soas.length > 0 ? soas[0] : null,
    };
  });

  return enrichedData;
}

export async function getControlById(
  organizationId: string,
  id: string,
): Promise<ControlDetailResponse> {
  const control = await prisma.control.findFirst({
    where: {
      id,
      OR: [{ organizationId }, { organizationId: null }],
    },
    include: {
      soas: {
        where: { organizationId }, // Only include SOA for user's organization
        select: {
          id: true,
          organizationId: true,
          controlId: true,
          managerId: true,
          status: true,
          notes: true,
          targetDate: true,
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
        },
      },
      treatments: {
        where: {
          treatment: { organizationId }, // Only include treatments from user's organization
        },
        include: {
          treatment: {
            select: {
              id: true,
              treatmentOpt: true,
              detailedActionPlan: true,
              startAction: true,
              endAction: true,
              isApprovedByTop: true,
              riskId: true,
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
            },
          },
        },
      },
    },
  });

  if (!control) {
    return null;
  }

  // Transform the response to match ControlDetailResponse
  const controlWithSOA: ControlDetailResponse = {
    ...control,
    soa: control.soas.length > 0 ? control.soas[0] : null,
    treatments: control.treatments.map((tc) => ({
      id: tc.treatment.id,
      treatmentOpt: tc.treatment.treatmentOpt,
      detailedActionPlan: tc.treatment.detailedActionPlan,
      startAction: tc.treatment.startAction,
      endAction: tc.treatment.endAction,
      isApprovedByTop: tc.treatment.isApprovedByTop,
      risk: tc.treatment.risk,
    })),
  };

  // Remove the soas array property since we now have soa
  delete (controlWithSOA as any).soas;

  return controlWithSOA;
}

export async function updateControl(
  organizationId: string,
  id: string,
  data: UpdateControlRequest,
): Promise<ControlResponse> {
  // Get the control first
  const control = await prisma.control.findFirst({
    where: { id },
  });

  if (!control) {
    throw new Error('Control tidak ditemukan');
  }

  // Check if organization owns this control or if it's a global (null) control
  // Organization cannot update global controls (organizationId = null)
  if (control.organizationId === null) {
    throw new Error('Anda tidak dapat mengubah control global');
  }

  // Check if control belongs to the organization
  if (control.organizationId !== organizationId) {
    throw new Error('Control ini bukan milik organisasi Anda');
  }

  const updatedControl = await prisma.control.update({
    where: { id },
    data: {
      code: data.code ?? control.code,
      category: data.category === undefined ? control.category : data.category,
      title: data.title ?? control.title,
      description: data.description === undefined ? control.description : data.description,
      isAnnex: data.isAnnex === undefined ? control.isAnnex : data.isAnnex,
    },
  });

  return updatedControl;
}

export async function deleteControl(organizationId: string, id: string): Promise<void> {
  // Get the control first
  const control = await prisma.control.findFirst({
    where: { id },
  });

  if (!control) {
    throw new Error('Control tidak ditemukan');
  }

  // Check if organization owns this control
  // Organization cannot delete global controls (organizationId = null)
  if (control.organizationId === null) {
    throw new Error('Anda tidak dapat menghapus control global');
  }

  // Check if control belongs to the organization
  if (control.organizationId !== organizationId) {
    throw new Error('Control ini bukan milik organisasi Anda');
  }

  await prisma.control.delete({
    where: { id },
  });
}

export async function getControlStatistics(
  organizationId: string,
): Promise<ControlStatisticsResponse> {
  // Get all annex controls (global controls with isAnnex = true)
  const totalAnnexControl = await prisma.control.count({
    where: {
      organizationId: null,
      isAnnex: true,
    },
  });

  // Get annex controls that have SOA created by the organization
  const totalAnnexControlAssessed = await prisma.sOA.count({
    where: {
      organizationId,
      control: {
        organizationId: null,
        isAnnex: true,
      },
    },
  });

  // Get controls added by the organization (organizationId matches)
  const totalAddedControl = await prisma.control.count({
    where: {
      organizationId,
    },
  });

  // Get organization's controls that have SOA created
  const totalAddedControlAssessed = await prisma.sOA.count({
    where: {
      organizationId,
      control: {
        organizationId,
      },
    },
  });

  // Get unassessed controls (annex + organization controls without SOA)
  // First get all annex controls
  const allAnnexControls = await prisma.control.findMany({
    where: {
      organizationId: null,
      isAnnex: true,
    },
    select: { id: true },
  });

  // Get all org controls
  const allOrgControls = await prisma.control.findMany({
    where: {
      organizationId,
    },
    select: { id: true },
  });

  const allControlIds = [
    ...allAnnexControls.map((c) => c.id),
    ...allOrgControls.map((c) => c.id),
  ];

  // Get controls that have SOA from this organization
  const assessedControls = await prisma.sOA.findMany({
    where: {
      organizationId,
      controlId: {
        in: allControlIds,
      },
    },
    select: { controlId: true },
  });

  const assessedControlIds = new Set(assessedControls.map((s: any) => s.controlId));
  const totalUnassessed = allControlIds.length - assessedControlIds.size;

  return {
    totalAnnexControl,
    totalAnnexControlAssessed,
    totalAddedControl,
    totalAddedControlAssessed,
    totalUnassessed,
  };
}

export async function getControlOptions(
  organizationId: string,
  search?: string,
): Promise<ControlOptionResponse[]> {
  const whereConditions: any = {
    AND: [
      {
        OR: [{ organizationId }, { organizationId: null }],
      },
    ],
  };

  // Add search filter
  if (search) {
    whereConditions.AND.push({
      OR: [
        { code: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  const controls = await prisma.control.findMany({
    where: whereConditions,
    select: {
      id: true,
      code: true,
      title: true,
    },
    orderBy: { code: 'asc' },
  });

  // Merge code and title into single title field
  return controls.map((control) => ({
    id: control.id,
    title: `${control.code} - ${control.title}`,
  }));
}
