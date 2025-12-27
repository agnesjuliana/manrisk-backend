export interface CreateRiskCriteriaRequest {
  isFMEA?: boolean;
  scale?: number;
  threshold?: number;
}

export interface UpdateRiskCriteriaRequest {
  isFMEA?: boolean;
  scale?: number;
  threshold?: number;
}

export interface RiskCriteriaResponse {
  id: string;
  organizationId: string;
  isFMEA: boolean;
  scale: number;
  threshold: number;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ScaleStatusDetail {
  id: string;
  level: number;
  title: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface RiskCriteriaWithScaleStatus {
  id: string;
  organizationId: string;
  isFMEA: boolean;
  scale: number;
  threshold: number;
  createdAt: Date;
  updatedAt: Date | null;
  scaleStatuses: ScaleStatusDetail[];
}
