import { type CreateRegulationRequest, type UpdateRegulationRequest } from '../../models/organization/regulation.model';
import { regulationRepository } from '../../repositories/organization/regulation.repository';

export const regulationService = {
  async getRegulations(organizationId: string) {
    return await regulationRepository.getRegulations(organizationId);
  },

  async getRegulationById(id: string, organizationId: string) {
    return await regulationRepository.getRegulationById(id, organizationId);
  },

  async createRegulation(organizationId: string, data: CreateRegulationRequest) {
    return await regulationRepository.createRegulation(organizationId, data);
  },

  async updateRegulation(
    id: string,
    organizationId: string,
    data: UpdateRegulationRequest,
  ) {
    return await regulationRepository.updateRegulation(id, organizationId, data);
  },

  async deleteRegulation(id: string, organizationId: string) {
    return await regulationRepository.deleteRegulation(id, organizationId);
  },
};
