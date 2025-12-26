import prisma from '../../config/prisma';
import {
  type UpsertScaleStatusRequest,
  type ScaleStatusResponse,
  type UpsertScaleStatusResponse,
} from '../../models/organization/scale-status.model';

const mapToScaleStatusResponse = (scaleStatus: any): ScaleStatusResponse => ({
  id: scaleStatus.id,
  riskCriteriaId: scaleStatus.riskCriteriaId,
  level: scaleStatus.level,
  title: scaleStatus.title,
  createdAt: scaleStatus.createdAt,
  updatedAt: scaleStatus.updatedAt,
});

export const scaleStatusRepository = {
  async upsertScaleStatus(
    organizationId: string,
    data: UpsertScaleStatusRequest,
  ): Promise<UpsertScaleStatusResponse> {
    // Get risk criteria for this organization
    const riskCriteria = await prisma.riskCriteria.findFirst({
      where: {
        organizationId,
        deletedAt: null,
      },
    });

    if (!riskCriteria) {
      throw new Error('Risk Criteria tidak ditemukan untuk organisasi ini');
    }

    // Get current scale statuses for this risk criteria
    const currentScaleStatuses = await prisma.scaleStatus.findMany({
      where: {
        riskCriteriaId: riskCriteria.id,
        deletedAt: null,
      },
      orderBy: {
        level: 'asc',
      },
    });

    // Determine which levels to delete (if scale is reduced)
    const newScale = data.scale;
    const currentMaxLevel = currentScaleStatuses.length;

    if (newScale < currentMaxLevel) {
      // Delete records with level > newScale
      await prisma.scaleStatus.deleteMany({
        where: {
          riskCriteriaId: riskCriteria.id,
          level: {
            gt: newScale,
          },
        },
      });
    }

    // Process each level in the scale_status array
    for (let index = 0; index < data.scale_status.length; index++) {
      const level = index + 1;
      const title = data.scale_status[index];

      const existingScaleStatus = currentScaleStatuses.find((ss) => ss.level === level);

      await (existingScaleStatus
        ? prisma.scaleStatus.update({
            where: { id: existingScaleStatus.id },
            data: { title },
          })
        : prisma.scaleStatus.create({
            data: {
              riskCriteriaId: riskCriteria.id,
              level,
              title,
            },
          }));
    }

    // Get final result
    const finalScaleStatuses = await prisma.scaleStatus.findMany({
      where: {
        riskCriteriaId: riskCriteria.id,
        deletedAt: null,
      },
      orderBy: {
        level: 'asc',
      },
    });

    return {
      data: finalScaleStatuses.map((ss) => mapToScaleStatusResponse(ss)),
      total: finalScaleStatuses.length,
    };
  },
};
