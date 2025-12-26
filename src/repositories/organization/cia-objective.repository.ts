import prisma from '../../config/prisma';
import {
  type UpsertCIAObjectiveRequest,
  type CIAObjectiveResponse,
  type CIAObjectivesResponse,
  type CIAObjectivesWithPrioritiesResponse,
  type ServicePriorityItem,
  type CreateServicePriorityRequest,
  type UpdateServicePriorityRequest,
  type ServicePriorityResponse,
} from '../../models/organization/cia-objective.model';

export const ciaObjectiveRepository = {
  // ===== CIA OBJECTIVE METHODS =====
  async upsertCIAObjective(
    organizationId: string,
    data: UpsertCIAObjectiveRequest,
  ): Promise<CIAObjectivesResponse> {
    // Upsert Confidentiality
    const confidentiality = await prisma.cIAObjective.upsert({
      where: {
        organizationId_type: {
          organizationId,
          type: 'C',
        },
      },
      create: {
        organizationId,
        type: 'C',
        value: data.confidentiality,
      },
      update: {
        value: data.confidentiality,
      },
      select: {
        id: true,
        organizationId: true,
        type: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Upsert Integrity
    const integrity = await prisma.cIAObjective.upsert({
      where: {
        organizationId_type: {
          organizationId,
          type: 'I',
        },
      },
      create: {
        organizationId,
        type: 'I',
        value: data.integrity,
      },
      update: {
        value: data.integrity,
      },
      select: {
        id: true,
        organizationId: true,
        type: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Upsert Availability
    const availability = await prisma.cIAObjective.upsert({
      where: {
        organizationId_type: {
          organizationId,
          type: 'A',
        },
      },
      create: {
        organizationId,
        type: 'A',
        value: data.availability,
      },
      update: {
        value: data.availability,
      },
      select: {
        id: true,
        organizationId: true,
        type: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      confidentiality: mapToCIAObjectiveResponse(confidentiality),
      integrity: mapToCIAObjectiveResponse(integrity),
      availability: mapToCIAObjectiveResponse(availability),
    };
  },

  async getCIAObjective(organizationId: string): Promise<CIAObjectivesResponse> {
    const objectives = await prisma.cIAObjective.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        organizationId: true,
        type: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const confidentiality = objectives.find((object) => object.type === 'C');
    const integrity = objectives.find((object) => object.type === 'I');
    const availability = objectives.find((object) => object.type === 'A');

    return {
      confidentiality: confidentiality ? mapToCIAObjectiveResponse(confidentiality) : null,
      integrity: integrity ? mapToCIAObjectiveResponse(integrity) : null,
      availability: availability ? mapToCIAObjectiveResponse(availability) : null,
    } as CIAObjectivesResponse;
  },

  async getCIAObjectiveWithPriorities(
    organizationId: string,
  ): Promise<CIAObjectivesWithPrioritiesResponse> {
    const objectives = await prisma.cIAObjective.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      select: {
        type: true,
        value: true,
      },
    });

    const priorities = await prisma.servicePriority.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        serviceName: true,
        cScore: true,
        iScore: true,
        aScore: true,
      },
    });

    const confidentiality = objectives.find((object) => object.type === 'C');
    const integrity = objectives.find((object) => object.type === 'I');
    const availability = objectives.find((object) => object.type === 'A');

    const servicePrioritiesFormatted: ServicePriorityItem[] = priorities.map((p) => ({
      priority_id: p.id,
      service: p.serviceName,
      C: p.cScore,
      I: p.iScore,
      A: p.aScore,
    }));

    return {
      cia_objectives: {
        confidentiality: confidentiality?.value || '',
        integrity: integrity?.value || '',
        availability: availability?.value || '',
        service_priorities: servicePrioritiesFormatted,
      },
    };
  },

  // ===== SERVICE PRIORITY METHODS =====
  async createServicePriority(
    organizationId: string,
    data: CreateServicePriorityRequest,
  ): Promise<ServicePriorityResponse> {
    const result = await prisma.servicePriority.create({
      data: {
        organizationId,
        contextId: data.context_id,
        serviceName: data.service_name,
        cScore: data.c_score,
        iScore: data.i_score,
        aScore: data.a_score,
      },
      select: {
        id: true,
        organizationId: true,
        contextId: true,
        serviceName: true,
        cScore: true,
        iScore: true,
        aScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return mapToServicePriorityResponse(result);
  },

  async getServicePriorityById(
    organizationId: string,
    id: string,
  ): Promise<ServicePriorityResponse | null> {
    const result = await prisma.servicePriority.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        organizationId: true,
        contextId: true,
        serviceName: true,
        cScore: true,
        iScore: true,
        aScore: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        context: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!result || result.organizationId !== organizationId || result.deletedAt !== null) {
      return null;
    }

    return mapToServicePriorityResponse(result);
  },

  async updateServicePriority(
    organizationId: string,
    id: string,
    data: UpdateServicePriorityRequest,
  ): Promise<ServicePriorityResponse> {
    const updateData: any = {};

    if (data.context_id !== undefined) {
      updateData.contextId = data.context_id;
    }

    if (data.service_name !== undefined) {
      updateData.serviceName = data.service_name;
    }

    if (data.c_score !== undefined) {
      updateData.cScore = data.c_score;
    }

    if (data.i_score !== undefined) {
      updateData.iScore = data.i_score;
    }

    if (data.a_score !== undefined) {
      updateData.aScore = data.a_score;
    }

    const result = await prisma.servicePriority.update({
      where: {
        id,
      },
      data: updateData,
      select: {
        id: true,
        organizationId: true,
        contextId: true,
        serviceName: true,
        cScore: true,
        iScore: true,
        aScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return mapToServicePriorityResponse(result);
  },

  async deleteServicePriority(organizationId: string, id: string): Promise<void> {
    await prisma.servicePriority.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};

// ===== HELPER FUNCTIONS =====
function mapToCIAObjectiveResponse(data: any): CIAObjectiveResponse {
  return {
    id: data.id,
    organizationId: data.organizationId,
    type: data.type,
    value: data.value,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt || new Date(),
  };
}

function mapToServicePriorityResponse(data: any): ServicePriorityResponse {
  return {
    context: data.context
      ? {
          id: data.context.id,
          name: data.context.name,
          description: data.context.description,
        }
      : null,
    id: data.id,
    organizationId: data.organizationId,
    contextId: data.contextId,
    serviceName: data.serviceName,
    cScore: data.cScore,
    iScore: data.iScore,
    aScore: data.aScore,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt || new Date(),
  };
}
