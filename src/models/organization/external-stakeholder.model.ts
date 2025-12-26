export interface CreateExternalStakeholderRequest {
  name: string;
  interest: string;
}

export interface UpdateExternalStakeholderRequest {
  name?: string;
  interest?: string;
}

export interface ExternalStakeholderResponse {
  id: string;
  organizationId: string;
  name: string;
  interest: string;
  createdAt: Date;
  updatedAt: Date;
}
