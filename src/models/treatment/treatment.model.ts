import  { type TreatmentOption } from '@prisma/client';

export interface CreateTreatmentRequest {
  riskId: string;
  picId: string;
  treatmentOpt: TreatmentOption;
  impactSeverityTarget?: number;
  likelihoodOccurenceTarget?: number;
  detectionTarget?: number;
  actionReason?: string;
  detailedActionPlan: string;
  startAction: string | Date;
  endAction: string | Date;
  notes?: string;
  controlIds: string[]; // Array of control IDs
}

export interface UpdateTreatmentRequest {
  picId?: string;
  treatmentOpt?: TreatmentOption;
  impactSeverityTarget?: number;
  likelihoodOccurenceTarget?: number;
  detectionTarget?: number;
  actionReason?: string;
  detailedActionPlan?: string;
  startAction?: string | Date;
  endAction?: string | Date;
  notes?: string;
  isApprovedByTop?: boolean; // Only for TOP_MANAGEMENT role
  controlIds?: string[]; // Array of control IDs
}

export interface TreatmentResponse {
  id: string;
  riskId: string;
  managerId: string;
  picId: string;
  organizationId: string;
  treatmentOpt: TreatmentOption;
  impactSeverityTarget?: number;
  likelihoodOccurenceTarget?: number;
  detectionTarget?: number;
  actionReason?: string;
  detailedActionPlan: string;
  startAction: Date;
  endAction: Date;
  notes?: string;
  isApprovedByTop?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  manager: {
    id: string;
    name: string;
    email: string;
  };
  pic: {
    id: string;
    name: string;
    email: string;
  };
  risk: {
    id: string;
    customRiskId: string;
    identifiedRisk: string;
    impactSeverity?: number;
    likelihoodOccurence?: number;
    detection?: number;
  };
  relatedControls: {
    id: string;
    code: string;
    title: string;
  }[];
}

export interface TreatmentWithRiskResponse {
  risk: {
    id: string;
    customRiskId: string;
    identifiedRisk: string;
    vulnerability: string;
    threat: string;
    impactSeverity?: number;
    likelihoodOccurence?: number;
    detection?: number;
    impactSeverityTarget?: number;
    likelihoodOccurenceTarget?: number;
    detectionTarget?: number;
  };
  treatment: TreatmentResponse | null;
  score: number; // Calculated score (impact*likelihood*detection or impact*likelihood)
}
