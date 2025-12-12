import Joi from 'joi';

/**
 * Schema Joi untuk create department
 */
export const createDepartmentJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama divisi minimal 3 karakter',
    'string.max': 'Nama divisi maksimal 255 karakter',
  }),
  description: Joi.string().max(1000).optional().messages({
    'string.max': 'Deskripsi maksimal 1000 karakter',
  }),
  isActive: Joi.boolean().default(true).messages({
    'boolean.base': 'isActive harus boolean',
  }),
});

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Schema Joi untuk update department
 */
export const updateDepartmentJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Nama divisi minimal 3 karakter',
    'string.max': 'Nama divisi maksimal 255 karakter',
  }),
  description: Joi.string().max(1000).optional().messages({
    'string.max': 'Deskripsi maksimal 1000 karakter',
  }),
  isActive: Joi.boolean().optional().messages({
    'boolean.base': 'isActive harus boolean',
  }),
});

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Grouped schemas for easier import
 */
export const manageDivisionJoiSchema = {
  create: createDepartmentJoiSchema,
  update: updateDepartmentJoiSchema,
};
