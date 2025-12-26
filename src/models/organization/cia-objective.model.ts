export interface UpsertCIAObjectiveRequest {
  confidentiality: string;
  integrity: string;
  availability: string;
}

export interface CIAObjectiveResponse {
  id: string;
  organizationId: string;
  type: 'C' | 'I' | 'A';
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CIAObjectivesResponse {
  confidentiality: CIAObjectiveResponse;
  integrity: CIAObjectiveResponse;
  availability: CIAObjectiveResponse;
}

export interface ServicePriorityItem {
  priority_id: string;
  service: string;
  C: number;
  I: number;
  A: number;
}

export interface CIAObjectivesWithPrioritiesResponse {
  cia_objectives: {
    confidentiality: string;
    integrity: string;
    availability: string;
    service_priorities: ServicePriorityItem[];
  };
}

export interface CreateServicePriorityRequest {
  context_id: string;
  service_name: string;
  c_score: number;
  i_score: number;
  a_score: number;
}

export interface UpdateServicePriorityRequest {
  context_id?: string;
  service_name?: string;
  c_score?: number;
  i_score?: number;
  a_score?: number;
}

export interface ServicePriorityResponse {
  id: string;
  organizationId: string;
  contextId: string;
  serviceName: string;
  cScore: number;
  iScore: number;
  aScore: number;
  context: {
    id: string;
    name: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
