export interface AssetForApproval {
  id: string;
  name: string;
}

export interface CreateAssetApprovalRequest {
  message?: string;
  assetIds: string[];
}

export interface UpdateAssetApprovalRequest {
  status: string;
}

export interface AssetApprovalAssetData {
  id: string;
  name: string;
  location: string | null;
  status: string;
  type: {
    id: string;
    title: string;
  };
  classification: {
    id: string;
    title: string;
  };
  owner: {
    id: string;
    name: string;
    department: {
      id: string;
      name: string | null;
    } | null;
  };
}

export interface AssetApprovalManagerData {
  id: string;
  name: string;
  email: string;
}

export interface AssetApprovalResponse {
  id: string;
  organizationId: string;
  manager: AssetApprovalManagerData;
  message: string | null;
  status: string;
  assets: AssetApprovalAssetData[];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
