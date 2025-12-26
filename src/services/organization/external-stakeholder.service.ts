import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware';
import {
  type CreateExternalStakeholderRequest,
  type UpdateExternalStakeholderRequest,
  type ExternalStakeholderResponse,
} from '../../models/organization/external-stakeholder.model';
import { externalStakeholderRepository } from '../../repositories/organization/external-stakeholder.repository';
import { validatePaginationParameters, type PaginatedResponse } from '../../utils/pagination';

export const externalStakeholderService = {
  async createExternalStakeholder(
    organizationId: string,
    data: CreateExternalStakeholderRequest,
  ): Promise<ExternalStakeholderResponse> {
    const stakeholder = await externalStakeholderRepository.createExternalStakeholder(
      organizationId,
      data,
    );

    return stakeholder;
  },

  async getExternalStakeholders(
    organizationId: string,
    page: number = 1,
    perPage: number = 10,
    search?: string,
  ): Promise<PaginatedResponse<ExternalStakeholderResponse>> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const { page: validPage, perPage: validPerPage } = validatePaginationParameters(
      page,
      perPage,
    );

    const result = await externalStakeholderRepository.getExternalStakeholdersByOrganizationId(
      organizationId,
      validPage,
      validPerPage,
      search,
    );

    return result;
  },

  async getExternalStakeholderById(
    organizationId: string,
    stakeholderId: string,
  ): Promise<ExternalStakeholderResponse> {
    const stakeholder =
      await externalStakeholderRepository.getExternalStakeholderById(stakeholderId);

    if (!stakeholder) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'External Stakeholder tidak ditemukan');
    }

    if (stakeholder.organizationId !== organizationId) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        'Anda tidak memiliki akses ke external stakeholder ini',
      );
    }

    return stakeholder;
  },

  async updateExternalStakeholder(
    organizationId: string,
    stakeholderId: string,
    data: UpdateExternalStakeholderRequest,
  ): Promise<ExternalStakeholderResponse> {
    const stakeholder =
      await externalStakeholderRepository.getExternalStakeholderById(stakeholderId);

    if (!stakeholder) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'External Stakeholder tidak ditemukan');
    }

    if (stakeholder.organizationId !== organizationId) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        'Anda tidak memiliki akses ke external stakeholder ini',
      );
    }

    const updated = await externalStakeholderRepository.updateExternalStakeholder(
      stakeholderId,
      data,
    );

    return updated;
  },

  async deleteExternalStakeholder(
    organizationId: string,
    stakeholderId: string,
  ): Promise<void> {
    const stakeholder =
      await externalStakeholderRepository.getExternalStakeholderById(stakeholderId);

    if (!stakeholder) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'External Stakeholder tidak ditemukan');
    }

    if (stakeholder.organizationId !== organizationId) {
      throw new CustomError(
        StatusCodes.FORBIDDEN,
        'Anda tidak memiliki akses ke external stakeholder ini',
      );
    }

    await externalStakeholderRepository.deleteExternalStakeholder(stakeholderId);
  },
};
