export interface CreateRiskCriteriaRequest {
  isFMEA: boolean;
  scale: number;
  threshold: number;
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

export interface RiskCriteriasResponse {
  data: RiskCriteriaResponse[];
  total: number;
}
