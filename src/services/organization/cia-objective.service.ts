import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware';
import {
  type UpsertCIAObjectiveRequest,
  type CIAObjectivesResponse,
  type CIAObjectivesWithPrioritiesResponse,
  type CreateServicePriorityRequest,
  type UpdateServicePriorityRequest,
  type ServicePriorityResponse,
} from '../../models/organization/cia-objective.model';
import { ciaObjectiveRepository } from '../../repositories/organization';

export const ciaObjectiveService = {
  async upsertCIAObjective(
    organizationId: string,
    data: UpsertCIAObjectiveRequest,
  ): Promise<CIAObjectivesResponse> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const result = await ciaObjectiveRepository.upsertCIAObjective(organizationId, data);

    return result;
  },

  async getCIAObjective(organizationId: string): Promise<CIAObjectivesResponse> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const result = await ciaObjectiveRepository.getCIAObjective(organizationId);

    if (!result.confidentiality || !result.integrity || !result.availability) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'CIA Objective belum tersedia');
    }

    return result;
  },

  async getCIAObjectiveWithPriorities(
    organizationId: string,
  ): Promise<CIAObjectivesWithPrioritiesResponse> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const result = await ciaObjectiveRepository.getCIAObjectiveWithPriorities(organizationId);

    if (!result.cia_objectives.confidentiality || !result.cia_objectives.integrity || !result.cia_objectives.availability) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'CIA Objective belum tersedia');
    }

    return result;
  },

  async createServicePriority(
    organizationId: string,
    data: CreateServicePriorityRequest,
  ): Promise<ServicePriorityResponse> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const result = await ciaObjectiveRepository.createServicePriority(organizationId, data);

    return result;
  },

  async getServicePriorityById(
    organizationId: string,
    id: string,
  ): Promise<ServicePriorityResponse> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const result = await ciaObjectiveRepository.getServicePriorityById(organizationId, id);

    if (!result) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Service Priority tidak ditemukan');
    }

    return result;
  },

  async updateServicePriority(
    organizationId: string,
    id: string,
    data: UpdateServicePriorityRequest,
  ): Promise<ServicePriorityResponse> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const existing = await ciaObjectiveRepository.getServicePriorityById(organizationId, id);

    if (!existing) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Service Priority tidak ditemukan');
    }

    const result = await ciaObjectiveRepository.updateServicePriority(
      organizationId,
      id,
      data,
    );

    return result;
  },

  async deleteServicePriority(organizationId: string, id: string): Promise<void> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const existing = await ciaObjectiveRepository.getServicePriorityById(organizationId, id);

    if (!existing) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Service Priority tidak ditemukan');
    }

    await ciaObjectiveRepository.deleteServicePriority(organizationId, id);
  },
};
