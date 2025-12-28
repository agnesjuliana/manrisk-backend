import prisma from '../../config/prisma';
import { type RiskSourceData } from '../../models/risk-register/risk-source.model';

export async function getRiskSources(
  organizationId: string,
  search?: string,
): Promise<RiskSourceData[]> {
  const sources = await prisma.riskSource.findMany({
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

  return sources;
}
