export interface AssetTypeInput {
  id?: string;
  name: string;
}

export interface AssetClassificationInput {
  id?: string;
  name: string;
}

export interface CreateAssetRequest {
  name: string;
  location?: string;
  type: AssetTypeInput;
  classification: AssetClassificationInput;
}

export interface UpdateAssetRequest {
  name?: string;
  location?: string;
  ownerId?: string;
  typeId?: string;
  classificationId?: string;
  status?: string;
}

export interface AssetTypeData {
  id: string;
  title: string;
}

export interface AssetClassificationData {
  id: string;
  title: string;
}

export interface AssetOwnerData {
  id: string;
  name: string;
}

export interface AssetResponse {
  id: string;
  organizationId: string;
  type: AssetTypeData;
  classification: AssetClassificationData;
  owner: AssetOwnerData;
  name: string;
  location: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
