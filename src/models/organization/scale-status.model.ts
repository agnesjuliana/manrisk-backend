export interface UpsertScaleStatusRequest {
  scale: number;
  scale_status: string[];
}

export interface ScaleStatusResponse {
  id: string;
  riskCriteriaId: string;
  level: number;
  title: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface UpsertScaleStatusResponse {
  data: ScaleStatusResponse[];
  total: number;
}
