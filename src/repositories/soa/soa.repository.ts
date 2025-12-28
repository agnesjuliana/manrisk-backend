import prisma from '../../config/prisma';
import {
  type CreateSOARequest,
  type UpdateSOARequest,
  type SOADetailResponse,
} from '../../models/soa';
import { calculateSkip, type PaginatedResponse } from '../../utils/pagination';

const soaDetailSelect = {
  id: true,
  organizationId: true,
  controlId: true,
  managerId: true,
  status: true,
  notes: true,
  targetDate: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  control: {
    select: {
      id: true,
      code: true,
      title: true,
      category: true,
    },
  },
  manager: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

export async function createSOA(
  organizationId: string,
  data: CreateSOARequest,
): Promise<SOADetailResponse> {
  // Validate control exists and belongs to organization or is global
  const control = await prisma.control.findFirst({
    where: {
      id: data.controlId,
      OR: [{ organizationId }, { organizationId: null }],
    },
  });

  if (!control) {
    throw new Error('Control tidak ditemukan atau bukan milik organisasi ini');
  }

  // Check if organization already has an SOA for this control
  const existingSOA = await prisma.sOA.findFirst({
    where: {
      organizationId,
      controlId: data.controlId,
    },
  });

  if (existingSOA) {
    throw new Error('Organisasi ini sudah membuat SOA untuk control ini');
  }

  // Validate manager exists and belongs to organization
  const manager = await prisma.user.findFirst({
    where: {
      id: data.managerId,
      organizationId,
    },
  });

  if (!manager) {
    // Debug: cek apakah user ada tapi di org berbeda
    const userExists = await prisma.user.findUnique({
      where: { id: data.managerId },
    });

    const error = userExists ? new Error(
        `Manager dengan ID ${data.managerId} ditemukan, tetapi tidak milik organisasi ini. User ini milik org: ${userExists.organizationId}`,
      ) : new Error(`Manager dengan ID ${data.managerId} tidak ditemukan di sistem`);

    throw error;
  }

  const soa = await prisma.sOA.create({
    data: {
      organizationId,
      controlId: data.controlId,
      managerId: data.managerId,
      status: (data.status || null) as any,
      notes: data.notes || null,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
    },
    select: soaDetailSelect,
  });

  return soa as SOADetailResponse;
}

export async function getSOAs(
  organizationId: string,
  page: number,
  perPage: number,
  search?: string,
  status?: string,
  targetDateFrom?: string | Date,
  targetDateTo?: string | Date,
): Promise<PaginatedResponse<SOADetailResponse>> {
  const skip = calculateSkip(page, perPage);

  const whereConditions: any = {
    organizationId,
  };

  // Add search filter
  if (search) {
    whereConditions.OR = [
      { control: { code: { contains: search, mode: 'insensitive' } } },
      { control: { title: { contains: search, mode: 'insensitive' } } },
      { manager: { name: { contains: search, mode: 'insensitive' } } },
    ];
  }

  // Add status filter
  if (status) {
    whereConditions.status = status;
  }

  // Add targetDate range filter
  if (targetDateFrom || targetDateTo) {
    whereConditions.targetDate = {};

    if (targetDateFrom) {
      whereConditions.targetDate.gte = new Date(targetDateFrom);
    }

    if (targetDateTo) {
      // Add 1 day to targetDateTo to include the entire day
      const toDate = new Date(targetDateTo);
      toDate.setDate(toDate.getDate() + 1);
      whereConditions.targetDate.lt = toDate;
    }
  }

  const [data, totalData] = await Promise.all([
    prisma.sOA.findMany({
      where: whereConditions,
      select: soaDetailSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.sOA.count({
      where: whereConditions,
    }),
  ]);

  const totalPage = Math.ceil(totalData / perPage);

  return {
    data: data as SOADetailResponse[],
    metadata: {
      page,
      per_page: perPage,
      total_data: totalData,
      total_page: totalPage,
    },
  };
}

export async function getSOAById(
  organizationId: string,
  id: string,
): Promise<SOADetailResponse | null> {
  const soa = await prisma.sOA.findFirst({
    where: {
      id,
      organizationId,
    },
    select: soaDetailSelect,
  });

  return soa as SOADetailResponse | null;
}

export async function updateSOA(
  organizationId: string,
  id: string,
  data: UpdateSOARequest,
): Promise<SOADetailResponse> {
  // Get the SOA first
  const soa = await prisma.sOA.findFirst({
    where: {
      id,
      organizationId,
    },
  });

  if (!soa) {
    throw new Error('SOA tidak ditemukan');
  }

  // Validate control if provided
  if (data.controlId) {
    const control = await prisma.control.findFirst({
      where: {
        id: data.controlId,
        OR: [{ organizationId }, { organizationId: null }],
      },
    });

    if (!control) {
      throw new Error('Control tidak ditemukan atau bukan milik organisasi ini');
    }
  }

  // Validate manager if provided
  if (data.managerId) {
    const manager = await prisma.user.findFirst({
      where: {
        id: data.managerId,
        organizationId,
      },
    });

    if (!manager) {
      const userExists = await prisma.user.findUnique({
        where: { id: data.managerId },
      });

      const error = userExists ? new Error(
          `Manager dengan ID ${data.managerId} ditemukan, tetapi tidak milik organisasi ini. User ini milik org: ${userExists.organizationId}`,
        ) : new Error(`Manager dengan ID ${data.managerId} tidak ditemukan di sistem`);

      throw error;
    }
  }

  const updatedSOA = await prisma.sOA.update({
    where: { id },
    data: {
      controlId: data.controlId ?? soa.controlId,
      managerId: data.managerId ?? soa.managerId,
      status: data.status === undefined ? soa.status : ((data.status || null) as any),
      notes: data.notes === undefined ? soa.notes : data.notes || null,
      targetDate:
        data.targetDate === undefined
          ? soa.targetDate
          : (data.targetDate
            ? new Date(data.targetDate)
            : null),
    },
    select: soaDetailSelect,
  });

  return updatedSOA as SOADetailResponse;
}

export async function deleteSOA(organizationId: string, id: string): Promise<void> {
  // Get the SOA first
  const soa = await prisma.sOA.findFirst({
    where: {
      id,
      organizationId,
    },
  });

  if (!soa) {
    throw new Error('SOA tidak ditemukan');
  }

  await prisma.sOA.delete({
    where: { id },
  });
}
