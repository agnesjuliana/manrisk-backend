export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface DepartmentResponse {
  id: string;
  organizationId: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
