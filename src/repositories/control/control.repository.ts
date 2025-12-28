import prisma from '../../config/prisma';
import {
  type CreateControlRequest,
  type UpdateControlRequest,
  type ControlResponse,
} from '../../models/control';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

export async function createControl(
  organizationId: string,
  data: CreateControlRequest,
): Promise<ControlResponse> {
  // Check if control with same code already exists for this organization or global
  const existingControl = await prisma.control.findFirst({
    where: {
      code: data.code,
      OR: [{ organizationId }, { organizationId: null }],
    },
  });

  if (existingControl) {
    throw new Error('Control dengan code yang sama sudah ada');
  }

  const control = await prisma.control.create({
    data: {
      code: data.code,
      category: data.category || null,
      title: data.title,
      description: data.description || null,
      isAnnex: data.isAnnex ?? false,
      organizationId,
    },
  });

  return control;
}

export async function getControls(
  organizationId: string,
  page: number,
  perPage: number,
  search?: string,
  isAnnex?: boolean,
): Promise<PaginatedResponse<ControlResponse>> {
  const skip = calculateSkip(page, perPage);

  const whereConditions: any = {
    AND: [
      {
        OR: [{ organizationId }, { organizationId: null }],
      },
    ],
  };

  // Add search filter
  if (search) {
    whereConditions.AND.push({
      OR: [
        { code: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  // Add isAnnex filter
  if (isAnnex !== undefined) {
    whereConditions.AND.push({ isAnnex });
  }

  const [data, totalData] = await Promise.all([
    prisma.control.findMany({
      where: whereConditions,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.control.count({
      where: whereConditions,
    }),
  ]);

  const totalPage = Math.ceil(totalData / perPage);

  return {
    data,
    metadata: {
      page,
      per_page: perPage,
      total_data: totalData,
      total_page: totalPage,
    },
  };
}

export async function getControlById(
  organizationId: string,
  id: string,
): Promise<ControlResponse | null> {
  const control = await prisma.control.findFirst({
    where: {
      id,
      OR: [{ organizationId }, { organizationId: null }],
    },
  });

  return control || null;
}

export async function updateControl(
  organizationId: string,
  id: string,
  data: UpdateControlRequest,
): Promise<ControlResponse> {
  // Get the control first
  const control = await prisma.control.findFirst({
    where: { id },
  });

  if (!control) {
    throw new Error('Control tidak ditemukan');
  }

  // Check if organization owns this control or if it's a global (null) control
  // Organization cannot update global controls (organizationId = null)
  if (control.organizationId === null) {
    throw new Error('Anda tidak dapat mengubah control global');
  }

  // Check if control belongs to the organization
  if (control.organizationId !== organizationId) {
    throw new Error('Control ini bukan milik organisasi Anda');
  }

  const updatedControl = await prisma.control.update({
    where: { id },
    data: {
      code: data.code ?? control.code,
      category: data.category === undefined ? control.category : data.category,
      title: data.title ?? control.title,
      description: data.description === undefined ? control.description : data.description,
      isAnnex: data.isAnnex === undefined ? control.isAnnex : data.isAnnex,
    },
  });

  return updatedControl;
}

export async function deleteControl(organizationId: string, id: string): Promise<void> {
  // Get the control first
  const control = await prisma.control.findFirst({
    where: { id },
  });

  if (!control) {
    throw new Error('Control tidak ditemukan');
  }

  // Check if organization owns this control
  // Organization cannot delete global controls (organizationId = null)
  if (control.organizationId === null) {
    throw new Error('Anda tidak dapat menghapus control global');
  }

  // Check if control belongs to the organization
  if (control.organizationId !== organizationId) {
    throw new Error('Control ini bukan milik organisasi Anda');
  }

  await prisma.control.delete({
    where: { id },
  });
}
