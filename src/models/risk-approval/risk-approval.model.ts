export interface RiskForApproval {
  id: string;
  customRiskId: string;
  identifiedRisk: string;
}

export interface CreateRiskApprovalRequest {
  message?: string;
  riskIds: string[];
}

export interface UpdateRiskApprovalRequest {
  status: string;
}

export interface RiskApprovalRiskData {
  id: string;
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
  category: {
    id: string;
    title: string;
  };
  source: {
    id: string;
    title: string;
  } | null;
  owner: {
    id: string;
    name: string;
    department: {
      id: string;
      name: string | null;
    } | null;
  };
}

export interface RiskApprovalManagerData {
  id: string;
  name: string;
  email: string;
}

export interface RiskApprovalResponse {
  id: string;
  organizationId: string;
  manager: RiskApprovalManagerData;
  message: string | null;
  status: string;
  risks: RiskApprovalRiskData[];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
