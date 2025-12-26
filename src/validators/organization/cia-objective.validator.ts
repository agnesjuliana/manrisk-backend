import Joi from 'joi';

export const upsertCIAObjectiveJoiSchema = Joi.object({
  confidentiality: Joi.string().min(3).max(500).required().messages({
    'string.min': 'Confidentiality objective minimal 3 karakter',
    'string.max': 'Confidentiality objective maksimal 500 karakter',
    'any.required': 'Confidentiality objective wajib diisi',
  }),
  integrity: Joi.string().min(3).max(500).required().messages({
    'string.min': 'Integrity objective minimal 3 karakter',
    'string.max': 'Integrity objective maksimal 500 karakter',
    'any.required': 'Integrity objective wajib diisi',
  }),
  availability: Joi.string().min(3).max(500).required().messages({
    'string.min': 'Availability objective minimal 3 karakter',
    'string.max': 'Availability objective maksimal 500 karakter',
    'any.required': 'Availability objective wajib diisi',
  }),
});

export const createServicePriorityJoiSchema = Joi.object({
  context_id: Joi.string().uuid().required().messages({
    'string.guid': 'Context ID harus berupa UUID yang valid',
    'any.required': 'Context ID wajib diisi',
  }),
  service_name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Service name minimal 3 karakter',
    'string.max': 'Service name maksimal 255 karakter',
    'any.required': 'Service name wajib diisi',
  }),
  c_score: Joi.number().integer().min(0).max(100).required().messages({
    'number.min': 'C Score minimal 0',
    'number.max': 'C Score maksimal 100',
    'any.required': 'C Score wajib diisi',
  }),
  i_score: Joi.number().integer().min(0).max(100).required().messages({
    'number.min': 'I Score minimal 0',
    'number.max': 'I Score maksimal 100',
    'any.required': 'I Score wajib diisi',
  }),
  a_score: Joi.number().integer().min(0).max(100).required().messages({
    'number.min': 'A Score minimal 0',
    'number.max': 'A Score maksimal 100',
    'any.required': 'A Score wajib diisi',
  }),
});

export const updateServicePriorityJoiSchema = Joi.object({
  context_id: Joi.string().uuid().optional().messages({
    'string.guid': 'Context ID harus berupa UUID yang valid',
  }),
  service_name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Service name minimal 3 karakter',
    'string.max': 'Service name maksimal 255 karakter',
  }),
  c_score: Joi.number().integer().min(0).max(100).optional().messages({
    'number.min': 'C Score minimal 0',
    'number.max': 'C Score maksimal 100',
  }),
  i_score: Joi.number().integer().min(0).max(100).optional().messages({
    'number.min': 'I Score minimal 0',
    'number.max': 'I Score maksimal 100',
  }),
  a_score: Joi.number().integer().min(0).max(100).optional().messages({
    'number.min': 'A Score minimal 0',
    'number.max': 'A Score maksimal 100',
  }),
});
