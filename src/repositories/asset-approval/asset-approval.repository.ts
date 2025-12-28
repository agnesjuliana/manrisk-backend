import prisma from '../../config/prisma';
import {
  type CreateAssetApprovalRequest,
  type UpdateAssetApprovalRequest,
  type AssetApprovalResponse,
} from '../../models/asset-approval';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

const assetApprovalSelect = {
  id: true,
  organizationId: true,
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  manager: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  assets: {
    select: {
      asset: {
        select: {
          id: true,
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
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
};

export async function createAssetApproval(
  organizationId: string,
  managerId: string,
  data: CreateAssetApprovalRequest,
): Promise<AssetApprovalResponse> {
  // Validate that all assets exist and have status DISETUJUI_RM
  const assets = await prisma.asset.findMany({
    where: {
      id: {
        in: data.assetIds,
      },
      organizationId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  // Check if all asset IDs were found
  if (assets.length !== data.assetIds.length) {
    throw new Error('Beberapa aset tidak ditemukan atau tidak milik organisasi ini');
  }

  // Check if all assets have status DISETUJUI_RM
  const invalidAssets = assets.filter(asset => asset.status !== 'DISETUJUI_RM');

  if (invalidAssets.length > 0) {
    throw new Error(
      `Hanya aset dengan status DISETUJUI_RM yang dapat diajukan. ${invalidAssets.length} aset memiliki status berbeda.`,
    );
  }

  // Create approval and update asset status in transaction
  const assetApproval = await prisma.assetApprovalTL.create({
    data: {
      organizationId,
      managerId,
      message: data.message || null,
      status: 'MENUNGGU_PERSETUJUAN_FINAL',
      assets: {
        create: data.assetIds.map(assetId => ({
          assetId,
        })),
      },
    },
    select: assetApprovalSelect,
  });

  // Update status of all assets to MENUNGGU_PERSETUJUAN_FINAL
  await prisma.asset.updateMany({
    where: {
      id: {
        in: data.assetIds,
      },
    },
    data: {
      status: 'MENUNGGU_PERSETUJUAN_FINAL',
    },
  });

  return mapAssetApprovalResponse(assetApproval);
}

export async function getAssetApprovals(
  organizationId: string,
  page: number,
  perPage: number,
): Promise<PaginatedResponse<AssetApprovalResponse>> {
  const skip = calculateSkip(page, perPage);

  const [data, totalData] = await Promise.all([
    prisma.assetApprovalTL.findMany({
      where: {
        organizationId,
      },
      select: assetApprovalSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.assetApprovalTL.count({
      where: {
        organizationId,
      },
    }),
  ]);

  const totalPage = Math.ceil(totalData / perPage);

  return {
    data: data.map(item => mapAssetApprovalResponse(item)),
    metadata: {
      page,
      per_page: perPage,
      total_data: totalData,
      total_page: totalPage,
    },
  };
}

export async function getAssetApprovalById(
  organizationId: string,
  assetApprovalId: string,
): Promise<AssetApprovalResponse | null> {
  const assetApproval = await prisma.assetApprovalTL.findFirst({
    where: {
      id: assetApprovalId,
      organizationId,
    },
    select: assetApprovalSelect,
  });

  if (!assetApproval) {
    return null;
  }

  return mapAssetApprovalResponse(assetApproval);
}

export async function updateAssetApproval(
  organizationId: string,
  assetApprovalId: string,
  data: UpdateAssetApprovalRequest,
): Promise<AssetApprovalResponse> {
  // Get all assets related to this approval
  const assetApproval = await prisma.assetApprovalTL.findFirst({
    where: {
      id: assetApprovalId,
      organizationId,
    },
    select: {
      assets: {
        select: {
          assetId: true,
        },
      },
    },
  });

  if (!assetApproval) {
    throw new Error('Approval aset tidak ditemukan');
  }

  const assetIds = assetApproval.assets.map(item => item.assetId);

  // Determine asset status based on approval status
  let assetStatusToUpdate: string | null = null;

  if (data.status === 'DISETUJUI') {
    assetStatusToUpdate = 'DISETUJUI';
  } else if (data.status === 'DITOLAK') {
    assetStatusToUpdate = 'REVISI';
  }

  // Update approval and assets in transaction if asset status needs to be updated
  if (assetStatusToUpdate) {
    const updatedApproval = await prisma.$transaction(async tx => {
      // Update approval status
      await tx.assetApprovalTL.update({
        where: {
          id: assetApprovalId,
        },
        data: {
          status: data.status as any,
        },
      });

      // Update all assets status
      await tx.asset.updateMany({
        where: {
          id: {
            in: assetIds,
          },
        },
        data: {
          status: assetStatusToUpdate as any,
        },
      });

      // Return updated approval with full details
      return tx.assetApprovalTL.findUnique({
        where: {
          id: assetApprovalId,
        },
        select: assetApprovalSelect,
      });
    });

    return mapAssetApprovalResponse(updatedApproval as any);
  } else {
    // Just update approval status without changing assets
    const updatedApproval = await prisma.assetApprovalTL.update({
      where: {
        id: assetApprovalId,
      },
      data: {
        status: data.status as any,
      },
      select: assetApprovalSelect,
    });

    return mapAssetApprovalResponse(updatedApproval);
  }
}

export async function deleteAssetApproval(
  organizationId: string,
  assetApprovalId: string,
): Promise<void> {
  // Get all assets related to this approval
  const assetApproval = await prisma.assetApprovalTL.findUnique({
    where: {
      id: assetApprovalId,
    },
    select: {
      assets: {
        select: {
          assetId: true,
        },
      },
    },
  });

  if (!assetApproval) {
    throw new Error('Approval aset tidak ditemukan');
  }

  const assetIds = assetApproval.assets.map(item => item.assetId);

  // Delete approval and revert asset status in transaction
  await prisma.$transaction([
    // Delete the approval
    prisma.assetApprovalTL.delete({
      where: {
        id: assetApprovalId,
      },
    }),
    // Revert all assets to DISETUJUI_RM status
    prisma.asset.updateMany({
      where: {
        id: {
          in: assetIds,
        },
      },
      data: {
        status: 'DISETUJUI_RM',
      },
    }),
  ]);
}

// Helper function to map response
function mapAssetApprovalResponse(data: any): AssetApprovalResponse {
  return {
    id: data.id,
    organizationId: data.organizationId,
    manager: data.manager,
    message: data.message,
    status: data.status,
    assets: data.assets.map((item: any) => item.asset),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deletedAt: data.deletedAt,
  };
}
