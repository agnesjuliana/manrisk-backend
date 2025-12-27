import prisma from '../../config/prisma';
import {
  type CreateRiskCriteriaRequest,
  type RiskCriteriaResponse,
  type ScaleStatusDetail,
} from '../../models/organization/risk-criteria.model';

const mapToRiskCriteriaResponse = (riskCriteria: any): RiskCriteriaResponse => ({
  id: riskCriteria.id,
  organizationId: riskCriteria.organizationId,
  isFMEA: riskCriteria.isFMEA,
  scale: riskCriteria.scale,
  threshold: riskCriteria.threshold,
  createdAt: riskCriteria.createdAt,
  updatedAt: riskCriteria.updatedAt,
});

export const riskCriteriaRepository = {
  async getRiskCriteria(organizationId: string): Promise<any> {
    const riskCriteria = await prisma.riskCriteria.findFirst({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        scaleStatuses: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            level: 'asc',
          },
        },
      },
    });

    if (!riskCriteria) {
      return null;
    }

    const scaleStatuses: ScaleStatusDetail[] = riskCriteria.scaleStatuses.map((ss) => ({
      id: ss.id,
      level: ss.level,
      title: ss.title,
      createdAt: ss.createdAt,
      updatedAt: ss.updatedAt,
    }));

    return {
      id: riskCriteria.id,
      organizationId: riskCriteria.organizationId,
      isFMEA: riskCriteria.isFMEA,
      scale: riskCriteria.scale,
      threshold: riskCriteria.threshold,
      createdAt: riskCriteria.createdAt,
      updatedAt: riskCriteria.updatedAt,
      scaleStatuses,
    };
  },

  async createRiskCriteria(
    organizationId: string,
    data: CreateRiskCriteriaRequest,
  ): Promise<RiskCriteriaResponse> {
    const riskCriteria = await prisma.riskCriteria.create({
      data: {
        organizationId,
        isFMEA: data.isFMEA,
        scale: data.scale,
        threshold: data.threshold,
      },
    });

    return mapToRiskCriteriaResponse(riskCriteria);
  },

  async upsertRiskCriteria(
    organizationId: string,
    data: CreateRiskCriteriaRequest,
  ): Promise<RiskCriteriaResponse> {
    // Get existing risk criteria for this organization
    const existingRiskCriteria = await prisma.riskCriteria.findFirst({
      where: {
        organizationId,
        deletedAt: null,
      },
    });

    if (existingRiskCriteria) {
      // Update existing - only update fields that are provided
      const updateData: any = {};

      if (data.isFMEA !== undefined) {
        updateData.isFMEA = data.isFMEA;
      }

      if (data.scale !== undefined) {
        updateData.scale = data.scale;
      }

      if (data.threshold !== undefined) {
        updateData.threshold = data.threshold;
      }

      const updatedRiskCriteria = await prisma.riskCriteria.update({
        where: { id: existingRiskCriteria.id },
        data: updateData,
      });

      return mapToRiskCriteriaResponse(updatedRiskCriteria);
    } else {
      // Create new with default values if not provided
      const riskCriteria = await prisma.riskCriteria.create({
        data: {
          organizationId,
          isFMEA: data.isFMEA ?? false,
          scale: data.scale ?? 5,
          threshold: data.threshold ?? 10,
        },
      });

      return mapToRiskCriteriaResponse(riskCriteria);
    }
  },
};
