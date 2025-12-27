import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware';
import {
  type CreateAssetApprovalRequest,
  type UpdateAssetApprovalRequest,
  type AssetApprovalResponse,
} from '../../models/asset-approval';
import {
  createAssetApproval,
  getAssetApprovals,
  getAssetApprovalById,
  updateAssetApproval,
  deleteAssetApproval,
} from '../../repositories/asset-approval';
import { validatePaginationParameters, type PaginatedResponse } from '../../utils/pagination';

export async function createAssetApprovalService(
  organizationId: string,
  managerId: string,
  data: CreateAssetApprovalRequest,
): Promise<AssetApprovalResponse> {
  return await createAssetApproval(organizationId, managerId, data);
}

export async function getAssetApprovalsService(
  organizationId: string,
  page: number = 1,
  perPage: number = 10,
): Promise<PaginatedResponse<AssetApprovalResponse>> {
  const { page: validPage, perPage: validPerPage } = validatePaginationParameters(
    page,
    perPage,
  );

  return await getAssetApprovals(organizationId, validPage, validPerPage);
}

export async function getAssetApprovalByIdService(
  organizationId: string,
  assetApprovalId: string,
): Promise<AssetApprovalResponse> {
  const assetApproval = await getAssetApprovalById(organizationId, assetApprovalId);

  if (!assetApproval) {
    throw new CustomError(StatusCodes.NOT_FOUND, 'Asset approval tidak ditemukan');
  }

  return assetApproval;
}

export async function updateAssetApprovalService(
  organizationId: string,
  assetApprovalId: string,
  data: UpdateAssetApprovalRequest,
): Promise<AssetApprovalResponse> {
  // Verify asset approval exists
  const existingApproval = await getAssetApprovalById(organizationId, assetApprovalId);

  if (!existingApproval) {
    throw new CustomError(StatusCodes.NOT_FOUND, 'Asset approval tidak ditemukan');
  }

  return await updateAssetApproval(organizationId, assetApprovalId, data);
}

export async function deleteAssetApprovalService(
  organizationId: string,
  assetApprovalId: string,
): Promise<void> {
  // Verify asset approval exists
  const existingApproval = await getAssetApprovalById(organizationId, assetApprovalId);

  if (!existingApproval) {
    throw new CustomError(StatusCodes.NOT_FOUND, 'Asset approval tidak ditemukan');
  }

  return await deleteAssetApproval(organizationId, assetApprovalId);
}
