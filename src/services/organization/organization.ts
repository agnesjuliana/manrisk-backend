import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../../middleware';
import { type UpsertOrganizationRequest, type OrganizationResponse } from '../../models/organization';
import { organizationRepository } from '../../repositories/organization';
import { userRepository } from '../../repositories/user';

export const organizationService = {
  async upsertOrganization(
    userId: string,
    data: UpsertOrganizationRequest,
  ): Promise<OrganizationResponse> {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
    }

    if (user.organizationId) {
      // UPDATE: User sudah memiliki organization
      const updated = await organizationRepository.updateOrganization(user.organizationId, data);

      return updated;
    }

    // CREATE: User belum memiliki organization
    const created = await organizationRepository.createOrganization(data);

    // Update user dengan organization ID yang baru
    await userRepository.updateUser(userId, {
      organizationId: created.id,
    });

    return created;
  },
};
