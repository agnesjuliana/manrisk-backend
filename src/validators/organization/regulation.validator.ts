import Joi from 'joi';

export const createRegulationJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama regulasi minimal 3 karakter',
    'string.max': 'Nama regulasi maksimal 255 karakter',
    'any.required': 'Nama regulasi wajib diisi',
  }),
});

export const updateRegulationJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Nama regulasi minimal 3 karakter',
    'string.max': 'Nama regulasi maksimal 255 karakter',
  }),
});
