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

export interface AssetResponse {
  id: string;
  organizationId: string;
  typeId: string;
  classificationId: string;
  ownerId: string;
  name: string;
  location: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface AssetsResponse {
  data: AssetResponse[];
  total: number;
}
