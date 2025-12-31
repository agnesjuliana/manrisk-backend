export interface CreateRiskRegisterRevisionRequest {
  riskId: string;
  impactSeverity: number;
  likelihoodOccurence: number;
  detection: number;
}

export interface UpdateRiskRegisterRevisionRequest {
  impactSeverity?: number;
  likelihoodOccurence?: number;
  detection?: number;
  isApprovedByOwner?: boolean;
}

export interface RiskCategoryData {
  id: string;
  title: string;
}

export interface RiskSourceData {
  id: string;
  title: string;
}

export interface ContextData {
  id: string;
  name: string;
}

export interface ManagerData {
  id: string;
  name: string;
  email: string;
}

export interface RiskRegisterRevisionResponse {
  id: string;
  riskId: string;
  managerId: string;
  customRiskId: string;
  vulnerability: string;
  threat: string;
  identifiedRisk: string;
  detail?: string;
  isConfidentiality: boolean;
  isIntegrity: boolean;
  isAvailability: boolean;
  impactSeverity?: number;
  likelihoodOccurence?: number;
  detection?: number;
  isApprovedByOwner?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  context?: ContextData;
  category: RiskCategoryData;
  source?: RiskSourceData;
  manager: ManagerData;
}

// For get all with treatment expand
export interface RiskDataWithRevision {
  id: string;
  customRiskId: string;
  vulnerability: string;
  threat: string;
  identifiedRisk: string;
  detail?: string;
  isConfidentiality: boolean;
  isIntegrity: boolean;
  isAvailability: boolean;
  impactSeverity?: number;
  likelihoodOccurence?: number;
  detection?: number;
  revisionLog?: RiskRegisterRevisionResponse | null;
}

export interface ControlData {
  id: string;
  code: string;
  title: string;
  category?: string;
  description?: string;
  isAnnex: boolean;
}

export interface TreatmentWithRiskRevisionResponse {
  id: string;
  riskId: string;
  treatmentOpt: string;
  detailedActionPlan: string;
  startAction: Date;
  endAction: Date;
  isApprovedByTop?: boolean;
  risk: RiskDataWithRevision;
  controls: ControlData[];
}
