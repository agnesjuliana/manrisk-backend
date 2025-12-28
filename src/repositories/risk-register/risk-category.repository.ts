import prisma from '../../config/prisma';
import { type RiskCategoryData } from '../../models/risk-register/risk-category.model';

export async function getRiskCategories(
  organizationId: string,
  search?: string,
): Promise<RiskCategoryData[]> {
  const categories = await prisma.riskCategory.findMany({
    where: {
      AND: [
        {
          OR: [
            { organizationId: null },
            { organizationId },
          ],
        },
        search
          ? {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {},
      ],
    },
    orderBy: { title: 'asc' },
  });

  return categories;
}
