import {
  type UpsertScaleStatusRequest,
  type UpsertScaleStatusResponse,
} from '../../models/organization/scale-status.model';
import { scaleStatusRepository } from '../../repositories/organization/scale-status.repository';

export const scaleStatusService = {
  async upsertScaleStatus(
    organizationId: string,
    data: UpsertScaleStatusRequest,
  ): Promise<UpsertScaleStatusResponse> {
    return await scaleStatusRepository.upsertScaleStatus(organizationId, data);
  },
};
