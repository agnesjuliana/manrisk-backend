import {
  type CreateRiskRegisterRevisionRequest,
  type UpdateRiskRegisterRevisionRequest,
  type RiskRegisterRevisionResponse,
  type TreatmentWithRiskRevisionResponse,
} from '../../models/risk-register';
import {
  createRiskRegisterRevision,
  getRiskRevisionsByOrganization,
  getRiskRevisionById,
  updateRiskRegisterRevision,
  deleteRiskRegisterRevision,
} from '../../repositories/risk-register/risk-register-revision.repository';
import { validatePaginationParameters, type PaginatedResponse } from '../../utils/pagination';

export async function createRiskRegisterRevisionService(
  organizationId: string,
  data: CreateRiskRegisterRevisionRequest,
): Promise<RiskRegisterRevisionResponse> {
  return await createRiskRegisterRevision(organizationId, data);
}

export async function getRiskRevisionsByOrganizationService(
  organizationId: string,
  page: number = 1,
  perPage: number = 10,
  search?: string,
): Promise<PaginatedResponse<TreatmentWithRiskRevisionResponse>> {
  const { page: validPage, perPage: validPerPage } = validatePaginationParameters(page, perPage);

  return await getRiskRevisionsByOrganization(organizationId, validPage, validPerPage, search);
}

export async function getRiskRevisionByIdService(
  organizationId: string,
  id: string,
): Promise<RiskRegisterRevisionResponse> {
  return await getRiskRevisionById(organizationId, id);
}

export async function updateRiskRegisterRevisionService(
  organizationId: string,
  id: string,
  data: UpdateRiskRegisterRevisionRequest,
): Promise<RiskRegisterRevisionResponse> {
  return await updateRiskRegisterRevision(organizationId, id, data);
}

export async function deleteRiskRegisterRevisionService(organizationId: string, id: string): Promise<void> {
  return await deleteRiskRegisterRevision(organizationId, id);
}
