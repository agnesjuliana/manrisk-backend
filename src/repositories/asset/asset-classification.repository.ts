import prisma from '../../config/prisma';
import {
  type AssetClassificationResponse,
  type AssetClassificationsResponse,
} from '../../models/asset';

export async function getAssetClassifications(
  organizationId: string,
): Promise<AssetClassificationsResponse> {
  const [data, total] = await Promise.all([
    prisma.assetClassification.findMany({
      where: {
        OR: [{ organizationId }, { organizationId: null }],
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.assetClassification.count({
      where: {
        OR: [{ organizationId }, { organizationId: null }],
      },
    }),
  ]);

  return {
    data: data as AssetClassificationResponse[],
    total,
  };
}
