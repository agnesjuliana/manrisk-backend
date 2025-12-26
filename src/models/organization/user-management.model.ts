export interface CreateUserManagementRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'RISK_MANAGER' | 'RISK_OWNER';
  division_id?: string;
}

export interface UpdateUserManagementRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'RISK_MANAGER' | 'RISK_OWNER';
  division_id?: string;
}

export interface UserManagementResponse {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: string;
  departmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
