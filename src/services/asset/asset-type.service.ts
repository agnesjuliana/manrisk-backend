import { type AssetTypesResponse } from '../../models/asset';
import { getAssetTypes } from '../../repositories/asset';

export async function getAssetTypesService(
  organizationId: string
): Promise<AssetTypesResponse> {
  return await getAssetTypes(organizationId);
}
