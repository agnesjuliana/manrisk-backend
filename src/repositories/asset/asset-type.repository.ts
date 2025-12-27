import prisma from '../../config/prisma';
import { type AssetTypeResponse, type AssetTypesResponse } from '../../models/asset';

export async function getAssetTypes(
  organizationId: string
): Promise<AssetTypesResponse> {
  const [data, total] = await Promise.all([
    prisma.assetType.findMany({
      where: {
        OR: [{ organizationId }, { organizationId: null }],
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.assetType.count({
      where: {
        OR: [{ organizationId }, { organizationId: null }],
      },
    }),
  ]);

  return {
    data: data as AssetTypeResponse[],
    total,
  };
}
