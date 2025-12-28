import {
  type CreateRiskRegisterRequest,
  type UpdateRiskRegisterRequest,
  type RiskRegisterResponse,
} from '../../models/risk-register';
import {
  createRiskRegister,
  getRiskRegisters,
  getRiskRegisterById,
  updateRiskRegister,
  deleteRiskRegister,
} from '../../repositories/risk-register/risk-register.repository';

export async function createRiskRegisterService(
  organizationId: string,
  userId: string,
  data: CreateRiskRegisterRequest,
): Promise<RiskRegisterResponse> {
  return await createRiskRegister(organizationId, userId, data);
}

export async function getRiskRegistersService(
  organizationId: string,
  page: number,
  perPage: number,
  role?: string,
  departmentId?: string,
  status?: string[],
): Promise<any> {
  return await getRiskRegisters(organizationId, page, perPage, role, departmentId, status);
}

export async function getRiskRegisterByIdService(
  organizationId: string,
  id: string,
): Promise<RiskRegisterResponse | null> {
  const riskRegister = await getRiskRegisterById(organizationId, id);

  if (!riskRegister) {
    throw new Error('Risk Register tidak ditemukan');
  }

  return riskRegister;
}

export async function updateRiskRegisterService(
  organizationId: string,
  id: string,
  data: UpdateRiskRegisterRequest,
): Promise<RiskRegisterResponse> {
  const riskRegister = await getRiskRegisterById(organizationId, id);

  if (!riskRegister) {
    throw new Error('Risk Register tidak ditemukan');
  }

  return await updateRiskRegister(organizationId, id, data);
}

export async function deleteRiskRegisterService(organizationId: string, id: string): Promise<void> {
  const riskRegister = await getRiskRegisterById(organizationId, id);

  if (!riskRegister) {
    throw new Error('Risk Register tidak ditemukan');
  }

  return await deleteRiskRegister(organizationId, id);
}
