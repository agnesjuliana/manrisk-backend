import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware';
import {
  type CreateContextRequest,
  type UpdateContextRequest,
  type ContextResponse,
} from '../../models/organization/context.model';
import { contextRepository } from '../../repositories/organization/context.repository';
import { validatePaginationParameters, type PaginatedResponse } from '../../utils/pagination';

export const contextService = {
  async createContext(
    organizationId: string,
    data: CreateContextRequest,
  ): Promise<ContextResponse> {
    const context = await contextRepository.createContext(organizationId, data);

    return context;
  },

  async getContexts(
    organizationId: string,
    page: number = 1,
    perPage: number = 10,
    search?: string,
  ): Promise<PaginatedResponse<ContextResponse>> {
    if (!organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'User harus memiliki organisasi');
    }

    const { page: validPage, perPage: validPerPage } = validatePaginationParameters(
      page,
      perPage,
    );

    const result = await contextRepository.getContextsByOrganizationId(
      organizationId,
      validPage,
      validPerPage,
      search,
    );

    return result;
  },

  async getContextById(
    organizationId: string,
    contextId: string,
  ): Promise<ContextResponse> {
    const context = await contextRepository.getContextById(contextId);

    if (!context) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Context tidak ditemukan');
    }

    if (context.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Anda tidak memiliki akses ke context ini');
    }

    return context;
  },

  async updateContext(
    organizationId: string,
    contextId: string,
    data: UpdateContextRequest,
  ): Promise<ContextResponse> {
    const context = await contextRepository.getContextById(contextId);

    if (!context) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Context tidak ditemukan');
    }

    if (context.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Anda tidak memiliki akses ke context ini');
    }

    const updated = await contextRepository.updateContext(contextId, data);

    return updated;
  },

  async deleteContext(organizationId: string, contextId: string): Promise<void> {
    const context = await contextRepository.getContextById(contextId);

    if (!context) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'Context tidak ditemukan');
    }

    if (context.organizationId !== organizationId) {
      throw new CustomError(StatusCodes.FORBIDDEN, 'Anda tidak memiliki akses ke context ini');
    }

    await contextRepository.deleteContext(contextId);
  },
};
