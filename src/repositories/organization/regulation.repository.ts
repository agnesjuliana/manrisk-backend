import prisma from '../../config/prisma';
import { type CreateRegulationRequest, type UpdateRegulationRequest, type RegulationResponse } from '../../models/organization/regulation.model';

export const regulationRepository = {
  async getRegulations(organizationId: string): Promise<{ data: RegulationResponse[]; total: number }> {
    const regulations = await prisma.regulation.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: regulations.map((regulation) => mapToRegulationResponse(regulation)),
      total: regulations.length,
    };
  },

  async getRegulationById(
    id: string,
    organizationId: string,
  ): Promise<RegulationResponse> {
    const regulation = await prisma.regulation.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });

    if (!regulation) {
      throw new Error('Regulasi tidak ditemukan');
    }

    return mapToRegulationResponse(regulation);
  },

  async createRegulation(
    organizationId: string,
    data: CreateRegulationRequest,
  ): Promise<RegulationResponse> {
    const regulation = await prisma.regulation.create({
      data: {
        organizationId,
        name: data.name,
      },
    });

    return mapToRegulationResponse(regulation);
  },

  async updateRegulation(
    id: string,
    organizationId: string,
    data: UpdateRegulationRequest,
  ): Promise<RegulationResponse> {
    const regulation = await prisma.regulation.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });

    if (!regulation) {
      throw new Error('Regulasi tidak ditemukan');
    }

    const updatedRegulation = await prisma.regulation.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return mapToRegulationResponse(updatedRegulation);
  },

  async deleteRegulation(id: string, organizationId: string): Promise<void> {
    const regulation = await prisma.regulation.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });

    if (!regulation) {
      throw new Error('Regulasi tidak ditemukan');
    }

    await prisma.regulation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};

function mapToRegulationResponse(regulation: any): RegulationResponse {
  return {
    id: regulation.id,
    organizationId: regulation.organizationId,
    name: regulation.name,
    createdAt: regulation.createdAt,
    updatedAt: regulation.updatedAt,
  };
}
