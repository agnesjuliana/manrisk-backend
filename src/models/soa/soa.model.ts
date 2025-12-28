export interface CreateSOARequest {
  controlId: string;
  managerId: string;
  status?: string;
  notes?: string;
  targetDate?: Date | string;
}

export interface UpdateSOARequest {
  controlId?: string;
  managerId?: string;
  status?: string;
  notes?: string;
  targetDate?: Date | string;
}

export interface SOAResponse {
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
}

export interface SOADetailResponse extends SOAResponse {
  control?: {
    id: string;
    code: string;
    title: string;
    category?: string;
  };
  manager?: {
    id: string;
    name: string;
    email: string;
  };
}
