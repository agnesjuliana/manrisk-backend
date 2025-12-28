export interface RiskCategoryInput {
  id?: string | null;
  name: string;
}

export interface RiskSourceInput {
  id?: string | null;
  name: string;
}

export interface CreateRiskRegisterRequest {
  assetId?: string;
  contextId?: string;
  ownerId?: string;
  riskcategory: RiskCategoryInput;
  source: RiskSourceInput;
  customRiskId: string;
  vulnerability: string;
  threat: string;
  identifiedRisk: string;
  detail?: string;
  isConfidentiality?: boolean;
  isIntegrity?: boolean;
  isAvailability?: boolean;
  impactSeverity?: number | null;
  likelihoodOccurence?: number | null;
  detection?: number | null;
}

export interface UpdateRiskRegisterRequest {
  assetId?: string;
  contextId?: string;
  ownerId?: string;
  riskcategory?: RiskCategoryInput;
  source?: RiskSourceInput;
  customRiskId?: string;
  vulnerability?: string;
  threat?: string;
  identifiedRisk?: string;
  detail?: string;
  isConfidentiality?: boolean;
  isIntegrity?: boolean;
  isAvailability?: boolean;
  impactSeverity?: number | null;
  likelihoodOccurence?: number | null;
  detection?: number | null;
  status?: string;
}

export interface RiskCategoryData {
  id: string;
  title: string;
}

export interface RiskSourceData {
  id: string;
  title: string;
}

export interface AssetData {
  id: string;
  name: string;
}

export interface ContextData {
  id: string;
  name: string;
}

export interface RiskOwnerData {
  id: string;
  name: string;
}

export interface RiskRegisterResponse {
  id: string;
  organizationId: string;
  ownerId: string;
  assetId: string | null;
  contextId: string | null;
  riskCategoryId: string;
  riskSourceId: string | null;
  customRiskId: string;
  vulnerability: string;
  threat: string;
  identifiedRisk: string;
  detail: string | null;
  isConfidentiality: boolean;
  isIntegrity: boolean;
  isAvailability: boolean;
  impactSeverity: number | null;
  likelihoodOccurence: number | null;
  detection: number | null;
  status: string | null;
  category?: RiskCategoryData;
  source?: RiskSourceData;
  asset?: AssetData;
  context?: ContextData;
  owner?: RiskOwnerData;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
