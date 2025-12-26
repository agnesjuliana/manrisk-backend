import prisma from '../../config/prisma';
import {
  type CreateRiskCriteriaRequest,
  type RiskCriteriaResponse,
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
      // Update existing
      const updatedRiskCriteria = await prisma.riskCriteria.update({
        where: { id: existingRiskCriteria.id },
        data: {
          isFMEA: data.isFMEA,
          scale: data.scale,
          threshold: data.threshold,
        },
      });

      return mapToRiskCriteriaResponse(updatedRiskCriteria);
    } else {
      // Create new
      const riskCriteria = await prisma.riskCriteria.create({
        data: {
          organizationId,
          isFMEA: data.isFMEA,
          scale: data.scale,
          threshold: data.threshold,
        },
      });

      return mapToRiskCriteriaResponse(riskCriteria);
    }
  },
};
