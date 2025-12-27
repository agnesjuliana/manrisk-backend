import prisma from '../../config/prisma';
import {
  type CreateAssetRequest,
  type UpdateAssetRequest,
  type AssetResponse,
} from '../../models/asset';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

export async function createAsset(
  organizationId: string,
  userId: string,
  data: CreateAssetRequest,
): Promise<AssetResponse> {
  // Handle type - check if exists or create if not
  let typeId = data.type.id;

  if (!typeId) {
    // Check if type with same title exists in org or in public (null organizationId)
    const existingType = await prisma.assetType.findFirst({
      where: {
        title: data.type.name,
        OR: [
          { organizationId },
          { organizationId: null },
        ],
      },
    });

    if (existingType) {
      typeId = existingType.id;
    } else {
      const newType = await prisma.assetType.create({
        data: {
          title: data.type.name,
          organizationId,
        },
      });
      typeId = newType.id;
    }
  }

  // Handle classification - check if exists or create if not
  let classificationId = data.classification.id;

  if (!classificationId) {
    // Check if classification with same title exists in org or in public (null organizationId)
    const existingClassification = await prisma.assetClassification.findFirst({
      where: {
        title: data.classification.name,
        OR: [
          { organizationId },
          { organizationId: null },
        ],
      },
    });

    if (existingClassification) {
      classificationId = existingClassification.id;
    } else {
      const newClassification = await prisma.assetClassification.create({
        data: {
          title: data.classification.name,
          organizationId,
        },
      });
      classificationId = newClassification.id;
    }
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
    select: {
      id: true,
      organizationId: true,
      name: true,
      location: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      type: {
        select: {
          id: true,
          title: true,
        },
      },
      classification: {
        select: {
          id: true,
          title: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return asset as AssetResponse;
}

export async function getAssets(
  organizationId: string,
  page: number,
  perPage: number,
): Promise<PaginatedResponse<AssetResponse>> {
  const skip = calculateSkip(page, perPage);

  const [data, totalData] = await Promise.all([
    prisma.asset.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        organizationId: true,
        name: true,
        location: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        type: {
          select: {
            id: true,
            title: true,
          },
        },
        classification: {
          select: {
            id: true,
            title: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.asset.count({
      where: {
        organizationId,
      },
    }),
  ]);

  const totalPage = Math.ceil(totalData / perPage);

  return {
    data: data as AssetResponse[],
    metadata: {
      page,
      per_page: perPage,
      total_data: totalData,
      total_page: totalPage,
    },
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
    select: {
      id: true,
      organizationId: true,
      name: true,
      location: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      type: {
        select: {
          id: true,
          title: true,
        },
      },
      classification: {
        select: {
          id: true,
          title: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return asset as AssetResponse;
}

export async function updateAsset(
  organizationId: string,
  assetId: string,
  data: UpdateAssetRequest,
): Promise<AssetResponse> {
  // Get current asset to know if we need to verify organization
  const currentAsset = await prisma.asset.findFirst({
    where: {
      id: assetId,
      organizationId,
    },
  });

  if (!currentAsset) {
    throw new Error('Asset not found');
  }

  // Handle type - check if exists or create if not
  let typeId = data.typeId;

  if (data.type && !data.type.id) {
    // Check if type with same title exists in org or in public (null organizationId)
    const existingType = await prisma.assetType.findFirst({
      where: {
        title: data.type.name,
        OR: [
          { organizationId },
          { organizationId: null },
        ],
      },
    });

    if (existingType) {
      typeId = existingType.id;
    } else {
      const newType = await prisma.assetType.create({
        data: {
          title: data.type.name,
          organizationId,
        },
      });
      typeId = newType.id;
    }
  }

  // Handle classification - check if exists or create if not
  let classificationId = data.classificationId;

  if (data.classification && !data.classification.id) {
    // Check if classification with same title exists in org or in public (null organizationId)
    const existingClassification = await prisma.assetClassification.findFirst({
      where: {
        title: data.classification.name,
        OR: [
          { organizationId },
          { organizationId: null },
        ],
      },
    });

    if (existingClassification) {
      classificationId = existingClassification.id;
    } else {
      const newClassification = await prisma.assetClassification.create({
        data: {
          title: data.classification.name,
          organizationId,
        },
      });
      classificationId = newClassification.id;
    }
  }

  // Filter out undefined values
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.ownerId !== undefined) updateData.ownerId = data.ownerId;
  if (typeId !== undefined) updateData.typeId = typeId;
  if (classificationId !== undefined) updateData.classificationId = classificationId;
  if (data.status !== undefined) updateData.status = data.status;

  const asset = await prisma.asset.update({
    where: {
      id: assetId,
    },
    data: updateData,
    select: {
      id: true,
      organizationId: true,
      name: true,
      location: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      type: {
        select: {
          id: true,
          title: true,
        },
      },
      classification: {
        select: {
          id: true,
          title: true,
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return asset as AssetResponse;
}

export async function deleteAsset(organizationId: string, assetId: string): Promise<void> {
  await prisma.asset.delete({
    where: {
      id: assetId,
    },
  });
}
