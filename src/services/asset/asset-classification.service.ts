import { type AssetClassificationsResponse } from '../../models/asset';
import { getAssetClassifications } from '../../repositories/asset';

export async function getAssetClassificationsService(
  organizationId: string
): Promise<AssetClassificationsResponse> {
  return await getAssetClassifications(organizationId);
}
