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
}
