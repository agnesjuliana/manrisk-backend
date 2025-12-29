import { type CreateSOARequest, type UpdateSOARequest, type SOADetailResponse } from '../../models/soa';
import { createSOA, deleteSOA, getSOAById, getSOAs, updateSOA } from '../../repositories/soa';
import { type PaginatedResponse } from '../../utils/pagination';

export async function createSOAService(
  organizationId: string,
  data: CreateSOARequest,
): Promise<SOADetailResponse> {
  return createSOA(organizationId, data);
}

export async function getSOAsService(
  organizationId: string,
  page: number,
  perPage: number,
  search?: string,
  status?: string,
  targetDateFrom?: string | Date,
  targetDateTo?: string | Date,
): Promise<PaginatedResponse<SOADetailResponse>> {
  return getSOAs(organizationId, page, perPage, search, status, targetDateFrom, targetDateTo);
}

export async function getSOAByIdService(
  organizationId: string,
  id: string,
): Promise<SOADetailResponse | null> {
  return getSOAById(organizationId, id);
}

export async function updateSOAService(
  organizationId: string,
  id: string,
  data: UpdateSOARequest,
): Promise<SOADetailResponse> {
  return updateSOA(organizationId, id, data);
}

export async function deleteSOAService(organizationId: string, id: string): Promise<void> {
  return deleteSOA(organizationId, id);
}
