export interface CreateContextRequest {
  name: string;
  description: string;
}

export interface UpdateContextRequest {
  name?: string;
  description?: string;
}

export interface ContextResponse {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
