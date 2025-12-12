import prisma from '../../config/prisma';
import {
  type UpsertOrganizationRequest,
  type OrganizationResponse,
} from '../../models/organization';

export const organizationRepository = {
  async createOrganization(data: UpsertOrganizationRequest): Promise<OrganizationResponse> {
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        address: data.address,
        email: data.email,
        noTelp: data.telp,
      },
      select: {
        id: true,
        name: true,
        address: true,
        email: true,
        noTelp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...organization,
    };
  },

  async updateOrganization(
    organizationId: string,
    data: UpsertOrganizationRequest,
  ): Promise<OrganizationResponse> {
    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        name: data.name,
        address: data.address,
        email: data.email,
        noTelp: data.telp,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        address: true,
        email: true,
        noTelp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...organization,
    };
  },

  async getOrganizationById(organizationId: string): Promise<OrganizationResponse | null> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        address: true,
        email: true,
        noTelp: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!organization) return null;

    return {
      ...organization,
    };
  },
};
