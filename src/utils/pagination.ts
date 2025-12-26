export interface PaginationMetadata {
  page: number;
  per_page: number;
  total_data: number;
  total_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMetadata;
}

export const calculatePaginationMetadata = (
  page: number,
  perPage: number,
  totalData: number,
): PaginationMetadata => {
  const totalPage = Math.ceil(totalData / perPage);

  return {
    page,
    per_page: perPage,
    total_data: totalData,
    total_page: totalPage,
  };
};

export const calculateSkip = (page: number, perPage: number): number => (page - 1) * perPage;

export const validatePaginationParams = (page: number, perPage: number): { page: number; perPage: number } => {
  const validPage = Math.max(1, page || 1);
  const validPerPage = Math.max(1, Math.min(100, perPage || 10));

  return {
    page: validPage,
    perPage: validPerPage,
  };
};
