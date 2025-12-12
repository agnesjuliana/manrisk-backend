export interface RegisterOrganizationRequest {
  name: string;
  address: string;
  email: string;
  noTelp: string;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  address: string;
  email: string;
  noTelp: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrganizationProfile extends OrganizationResponse {
  departmentsCount?: number;
  usersCount?: number;
}
