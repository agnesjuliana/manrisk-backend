import { type CreateControlRequest, type UpdateControlRequest, type ControlResponse, type ControlDetailResponse, type ControlStatisticsResponse, type ControlOptionResponse } from '../../models/control';
import {
  createControl,
  deleteControl,
  getControlById,
  getControls,
  updateControl,
  getControlStatistics,
  getControlOptions,
} from '../../repositories/control';

export async function createControlService(
  organizationId: string,
  data: CreateControlRequest,
): Promise<ControlResponse> {
  return createControl(organizationId, data);
}

export async function getControlsService(
  organizationId: string,
  search?: string,
  isAnnex?: boolean,
): Promise<ControlResponse[]> {
  return getControls(organizationId, search, isAnnex);
}

export async function getControlByIdService(
  organizationId: string,
  id: string,
): Promise<ControlDetailResponse | null> {
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

export async function getControlStatisticsService(
  organizationId: string,
): Promise<ControlStatisticsResponse> {
  return getControlStatistics(organizationId);
}

export async function getControlOptionsService(
  organizationId: string,
  search?: string,
): Promise<ControlOptionResponse[]> {
  return getControlOptions(organizationId, search);
}
