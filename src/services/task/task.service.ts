import { getAssetTasks, getRiskTasks, getTreatmentTasks, getControlTasks, getSOATasks } from '../../repositories/task';
import { type UserTasksResponse } from '../../models/task';

export async function getUserTasksService(
  organizationId: string,
  userId: string,
  userRole: string,
  departmentId?: string,
): Promise<UserTasksResponse> {
  const [assetTasks, riskTasks, treatmentTasks, controlTasks, soaTasks] = await Promise.all([
    getAssetTasks(organizationId, userId, userRole, departmentId),
    getRiskTasks(organizationId, userId, userRole, departmentId),
    getTreatmentTasks(organizationId, userId, userRole),
    getControlTasks(),
    getSOATasks(organizationId, userId),
  ]);

  return {
    assets: assetTasks,
    risks: riskTasks,
    treatments: treatmentTasks,
    controls: controlTasks,
    soas: soaTasks,
  };
}
