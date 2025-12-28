import { type RiskSourceData } from '../../models/risk-register/risk-source.model';
import { getRiskSources } from '../../repositories/risk-register/risk-source.repository';

export async function getRiskSourcesService(
  organizationId: string,
  search?: string,
): Promise<RiskSourceData[]> {
  return await getRiskSources(organizationId, search);
}
