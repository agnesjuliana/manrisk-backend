import prisma from '../../config/prisma';
import {
  type CreateAssetRequest,
  type UpdateAssetRequest,
  type AssetResponse,
  type AssetsResponse,
} from '../../models/asset';

export async function createAsset(
  organizationId: string,
  userId: string,
  data: CreateAssetRequest,
): Promise<AssetResponse> {
  // Handle type - create if not exists
  let typeId = data.type.id;

  if (!typeId) {
    const newType = await prisma.assetType.create({
      data: {
        title: data.type.name,
        organizationId,
      },
    });
    typeId = newType.id;
  }

  // Handle classification - create if not exists
  let classificationId = data.classification.id;

  if (!classificationId) {
    const newClassification = await prisma.assetClassification.create({
      data: {
        title: data.classification.name,
        organizationId,
      },
    });
    classificationId = newClassification.id;
  }

  // Create asset
  const asset = await prisma.asset.create({
    data: {
      organizationId,
      typeId,
      classificationId,
      ownerId: userId,
      name: data.name,
      location: data.location || null,
      status: 'DRAFT',
    },
  });

  return asset;
}

export async function getAssets(organizationId: string): Promise<AssetsResponse> {
  const [data, total] = await Promise.all([
    prisma.asset.findMany({
      where: {
        organizationId,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.asset.count({
      where: {
        organizationId,
      },
    }),
  ]);

  return {
    data,
    total,
  };
}

export async function getAssetById(
  organizationId: string,
  assetId: string,
): Promise<AssetResponse> {
  const asset = await prisma.asset.findFirst({
    where: {
      id: assetId,
      organizationId,
    },
  });

  return asset;
}

export async function updateAsset(
  organizationId: string,
  assetId: string,
  data: UpdateAssetRequest,
): Promise<AssetResponse> {
  // Filter out undefined values
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.ownerId !== undefined) updateData.ownerId = data.ownerId;
  if (data.typeId !== undefined) updateData.typeId = data.typeId;
  if (data.classificationId !== undefined) updateData.classificationId = data.classificationId;
  if (data.status !== undefined) updateData.status = data.status;

  const asset = await prisma.asset.update({
    where: {
      id: assetId,
    },
    data: updateData,
  });

  return asset;
}

export async function deleteAsset(organizationId: string, assetId: string): Promise<void> {
  await prisma.asset.delete({
    where: {
      id: assetId,
    },
  });
}
