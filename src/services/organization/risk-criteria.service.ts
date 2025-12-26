import {
  type CreateRiskCriteriaRequest,
  type RiskCriteriaResponse,
} from '../../models/organization/risk-criteria.model';
import { riskCriteriaRepository } from '../../repositories/organization/risk-criteria.repository';

export const riskCriteriaService = {
  async getRiskCriteria(organizationId: string): Promise<any> {
    return await riskCriteriaRepository.getRiskCriteria(organizationId);
  },

  async upsertRiskCriteria(
    organizationId: string,
    data: CreateRiskCriteriaRequest,
  ): Promise<RiskCriteriaResponse> {
    return await riskCriteriaRepository.upsertRiskCriteria(organizationId, data);
  },
};
