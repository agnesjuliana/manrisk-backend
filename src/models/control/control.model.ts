export interface CreateControlRequest {
  code: string;
  category?: string;
  title: string;
  description?: string;
  isAnnex?: boolean;
}

export interface UpdateControlRequest {
  code?: string;
  category?: string;
  title?: string;
  description?: string;
  isAnnex?: boolean;
}

export interface ControlResponse {
  id: string;
  code: string;
  category?: string;
  title: string;
  description?: string;
  isAnnex: boolean;
  organizationId?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  countRelatedTreatment?: number;
  soa?: {
    id: string;
    organizationId: string;
    controlId: string;
    managerId: string;
    status?: string;
    notes?: string;
    targetDate?: Date;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  } | null;
}

export interface TreatmentInControl {
  id: string;
  treatmentOpt: string;
  detailedActionPlan: string;
  startAction: Date;
  endAction: Date;
  isApprovedByTop?: boolean;
  risk?: {
    id: string;
    customRiskId: string;
    identifiedRisk: string;
    impactSeverity?: number;
    likelihoodOccurence?: number;
    detection?: number;
  };
}

export interface ControlDetailResponse extends ControlResponse {
  treatments?: TreatmentInControl[];
}

