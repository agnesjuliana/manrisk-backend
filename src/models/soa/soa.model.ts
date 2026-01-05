export interface CreateSOARequest {
  controlId: string;
  managerId?: string | null;
  status?: string;
  notes?: string;
  targetDate?: Date | string;
}

export interface UpdateSOARequest {
  controlId?: string;
  managerId?: string | null;
  status?: string;
  implementationStatus?: string;
  notes?: string;
  targetDate?: Date | string;
}

export interface SOAResponse {
  id: string;
  organizationId: string;
  controlId: string;
  managerId?: string | null;
  status?: string;
  implementationStatus?: string;
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
  } | null;
}

export interface SOAListItemResponse extends SOAResponse {
  statusTarget?: 'ON_TRACK' | 'OVERDUE';
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
