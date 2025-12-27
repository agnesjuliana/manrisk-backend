export interface AssetTypeResponse {
  id: string;
  organizationId: string | null;
  title: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface AssetTypesResponse {
  data: AssetTypeResponse[];
  total: number;
}
