import { type DashboardStatisticsResponse } from '../../models/statistics';
import { getDashboardStatistics } from '../../repositories/statistics';

export async function getDashboardStatisticsService(
  organizationId: string,
): Promise<DashboardStatisticsResponse> {
  return getDashboardStatistics(organizationId);
}
