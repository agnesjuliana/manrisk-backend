import Joi from 'joi';

export const createDepartmentJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama departemen minimal 3 karakter',
    'string.max': 'Nama departemen maksimal 255 karakter',
    'any.required': 'Nama departemen wajib diisi',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Deskripsi departemen maksimal 500 karakter',
  }),
  isActive: Joi.boolean().optional().default(true),
});

export const updateDepartmentJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Nama departemen minimal 3 karakter',
    'string.max': 'Nama departemen maksimal 255 karakter',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Deskripsi departemen maksimal 500 karakter',
  }),
  isActive: Joi.boolean().optional(),
});
