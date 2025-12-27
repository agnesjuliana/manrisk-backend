export interface AssetClassificationResponse {
  id: string;
  organizationId: string | null;
  title: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface AssetClassificationsResponse {
  data: AssetClassificationResponse[];
  total: number;
}
