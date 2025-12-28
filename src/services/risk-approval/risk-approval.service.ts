import {
  type CreateRiskApprovalRequest,
  type UpdateRiskApprovalRequest,
  type RiskApprovalResponse,
} from '../../models/risk-approval';
import {
  createRiskApproval,
  getRiskApprovals,
  getRiskApprovalById,
  updateRiskApproval,
  deleteRiskApproval,
} from '../../repositories/risk-approval';

export async function createRiskApprovalService(
  organizationId: string,
  managerId: string,
  data: CreateRiskApprovalRequest,
): Promise<RiskApprovalResponse> {
  return await createRiskApproval(organizationId, managerId, data);
}

export async function getRiskApprovalsService(
  organizationId: string,
  page: number,
  perPage: number,
): Promise<any> {
  return await getRiskApprovals(organizationId, page, perPage);
}

export async function getRiskApprovalByIdService(
  organizationId: string,
  id: string,
): Promise<RiskApprovalResponse | null> {
  const riskApproval = await getRiskApprovalById(organizationId, id);

  if (!riskApproval) {
    throw new Error('Risk Approval tidak ditemukan');
  }

  return riskApproval;
}

export async function updateRiskApprovalService(
  organizationId: string,
  id: string,
  data: UpdateRiskApprovalRequest,
): Promise<RiskApprovalResponse> {
  return await updateRiskApproval(organizationId, id, data);
}

export async function deleteRiskApprovalService(organizationId: string, id: string): Promise<void> {
  return await deleteRiskApproval(organizationId, id);
}
