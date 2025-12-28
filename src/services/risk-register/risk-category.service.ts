import { type RiskCategoryData } from '../../models/risk-register/risk-category.model';
import { getRiskCategories } from '../../repositories/risk-register/risk-category.repository';

export async function getRiskCategoriesService(
  organizationId: string,
  search?: string,
): Promise<RiskCategoryData[]> {
  return await getRiskCategories(organizationId, search);
}
