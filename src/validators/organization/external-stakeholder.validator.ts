import Joi from 'joi';

export const createExternalStakeholderJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama stakeholder minimal 3 karakter',
    'string.max': 'Nama stakeholder maksimal 255 karakter',
    'any.required': 'Nama stakeholder wajib diisi',
  }),
  interest: Joi.string().min(3).max(500).required().messages({
    'string.min': 'Interest minimal 3 karakter',
    'string.max': 'Interest maksimal 500 karakter',
    'any.required': 'Interest wajib diisi',
  }),
});

export const updateExternalStakeholderJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Nama stakeholder minimal 3 karakter',
    'string.max': 'Nama stakeholder maksimal 255 karakter',
  }),
  interest: Joi.string().min(3).max(500).optional().messages({
    'string.min': 'Interest minimal 3 karakter',
    'string.max': 'Interest maksimal 500 karakter',
  }),
});
