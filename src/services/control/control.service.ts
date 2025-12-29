import { type CreateControlRequest, type UpdateControlRequest, type ControlResponse } from '../../models/control';
import {
  createControl,
  deleteControl,
  getControlById,
  getControls,
  updateControl,
} from '../../repositories/control';
import { type PaginatedResponse } from '../../utils/pagination';

export async function createControlService(
  organizationId: string,
  data: CreateControlRequest,
): Promise<ControlResponse> {
  return createControl(organizationId, data);
}

export async function getControlsService(
  organizationId: string,
  page: number,
  perPage: number,
  search?: string,
  isAnnex?: boolean,
): Promise<PaginatedResponse<ControlResponse>> {
  return getControls(organizationId, page, perPage, search, isAnnex);
}

export async function getControlByIdService(
  organizationId: string,
  id: string,
): Promise<ControlResponse | null> {
  return getControlById(organizationId, id);
}

export async function updateControlService(
  organizationId: string,
  id: string,
  data: UpdateControlRequest,
): Promise<ControlResponse> {
  return updateControl(organizationId, id, data);
}

export async function deleteControlService(organizationId: string, id: string): Promise<void> {
  return deleteControl(organizationId, id);
}
