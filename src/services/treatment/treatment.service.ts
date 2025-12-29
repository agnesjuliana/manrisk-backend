import {
  type CreateTreatmentRequest,
  type TreatmentResponse,
  type TreatmentWithRiskResponse,
  type UpdateTreatmentRequest,
} from '../../models/treatment';
import {
  createTreatment,
  deleteTreatment,
  getTreatmentById,
  getTreatments,
  updateTreatment,
} from '../../repositories/treatment';
import { type PaginatedResponse } from '../../utils/pagination';

export async function createTreatmentService(
  organizationId: string,
  managerId: string,
  data: CreateTreatmentRequest,
): Promise<TreatmentResponse> {
  return createTreatment(organizationId, managerId, data);
}

export async function getTreatmentsService(
  organizationId: string,
  page: number,
  perPage: number,
): Promise<PaginatedResponse<TreatmentWithRiskResponse>> {
  return getTreatments(organizationId, page, perPage);
}

export async function getTreatmentByIdService(
  organizationId: string,
  id: string,
): Promise<TreatmentResponse | null> {
  return getTreatmentById(organizationId, id);
}

export async function updateTreatmentService(
  organizationId: string,
  id: string,
  data: UpdateTreatmentRequest,
): Promise<TreatmentResponse> {
  return updateTreatment(organizationId, id, data);
}

export async function deleteTreatmentService(organizationId: string, id: string): Promise<void> {
  return deleteTreatment(organizationId, id);
}
