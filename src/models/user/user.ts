/**
 * User Models & Interfaces
 */

export interface RegisterUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'RISK_MANAGER' | 'RISK_OWNER' | 'TOP_MANAGEMENT';
  createdAt: Date;
}

export interface LoginUserResponse {
  user: UserResponse;
  token: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'RISK_MANAGER' | 'RISK_OWNER' | 'TOP_MANAGEMENT';
  organizationId?: string;
  departmentId?: string;
  createdAt: Date;
  updatedAt?: Date;
  organization?: {
    id: string;
    name: string;
    address: string;
    email: string;
    noTelp: string;
  } | null;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}
