import Joi from 'joi';

export const createContextJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama context minimal 3 karakter',
    'string.max': 'Nama context maksimal 255 karakter',
    'any.required': 'Nama context wajib diisi',
  }),
  description: Joi.string().max(500).required().messages({
    'string.max': 'Deskripsi context maksimal 500 karakter',
    'any.required': 'Deskripsi context wajib diisi',
  }),
});

export const updateContextJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Nama context minimal 3 karakter',
    'string.max': 'Nama context maksimal 255 karakter',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Deskripsi context maksimal 500 karakter',
  }),
});
