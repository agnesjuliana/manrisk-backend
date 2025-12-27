import {
  type CreateAssetRequest,
  type UpdateAssetRequest,
  type AssetResponse,
  type AssetsResponse,
} from '../../models/asset';
import {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} from '../../repositories/asset';

export async function createAssetService(
  organizationId: string,
  userId: string,
  data: CreateAssetRequest,
): Promise<AssetResponse> {
  return await createAsset(organizationId, userId, data);
}

export async function getAssetsService(organizationId: string): Promise<AssetsResponse> {
  return await getAssets(organizationId);
}

export async function getAssetByIdService(
  organizationId: string,
  assetId: string,
): Promise<AssetResponse | null> {
  return await getAssetById(organizationId, assetId);
}

export async function updateAssetService(
  organizationId: string,
  assetId: string,
  data: UpdateAssetRequest,
): Promise<AssetResponse> {
  return await updateAsset(organizationId, assetId, data);
}

export async function deleteAssetService(
  organizationId: string,
  assetId: string,
): Promise<void> {
  return await deleteAsset(organizationId, assetId);
}
