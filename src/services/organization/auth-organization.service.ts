import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware/error.middleware';
import { type RegisterOrganizationRequest, type OrganizationResponse } from '../../models/organization';
import { organizationRepository } from '../../repositories/organization';
import { userRepository } from '../../repositories/user';

export const organizationService = {
  async registerOrganization(
    userId: string,
    data: RegisterOrganizationRequest,
  ): Promise<OrganizationResponse> {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    if (user.organizationId) {
      // UPSERT: Update existing organization
      const organization = await organizationRepository.updateOrganization(user.organizationId, {
        name: data.name,
        address: data.address,
        email: data.email,
        noTelp: data.noTelp,
      });

      return {
        id: organization.id,
        name: organization.name,
        address: organization.address,
        email: organization.email,
        noTelp: organization.noTelp,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
      };
    }

    // CREATE: Buat organization baru dan attach ke user
    const organization = await organizationRepository.createOrganization({
      name: data.name,
      address: data.address,
      email: data.email,
      noTelp: data.noTelp,
    });

    // Update user dengan organization ID
    await userRepository.updateUser(userId, {
      organizationId: organization.id,
    });

    return {
      id: organization.id,
      name: organization.name,
      address: organization.address,
      email: organization.email,
      noTelp: organization.noTelp,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  },
};
