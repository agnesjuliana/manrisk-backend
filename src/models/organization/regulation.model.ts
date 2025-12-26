export interface CreateRegulationRequest {
  name: string;
}

export interface UpdateRegulationRequest {
  name?: string;
}

export interface RegulationResponse {
  id: string;
  organizationId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface RegulationsResponse {
  data: RegulationResponse[];
  total: number;
}
