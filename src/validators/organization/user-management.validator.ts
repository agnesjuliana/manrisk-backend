import Joi from 'joi';

export const createUserManagementJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama minimal 3 karakter',
    'string.max': 'Nama maksimal 255 karakter',
    'any.required': 'Nama wajib diisi',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email tidak valid',
    'any.required': 'Email wajib diisi',
  }),
  password: Joi.string().min(6).max(255).required().messages({
    'string.min': 'Password minimal 6 karakter',
    'string.max': 'Password maksimal 255 karakter',
    'any.required': 'Password wajib diisi',
  }),
  role: Joi.string()
    .valid('ADMIN', 'RISK_MANAGER', 'RISK_OWNER')
    .required()
    .messages({
      'any.only': 'Role harus salah satu dari: ADMIN, RISK_MANAGER, RISK_OWNER',
      'any.required': 'Role wajib diisi',
    }),
  division_id: Joi.string().uuid().optional().messages({
    'string.guid': 'Division ID harus berupa UUID',
  }),
});

export const updateUserManagementJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Nama minimal 3 karakter',
    'string.max': 'Nama maksimal 255 karakter',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email tidak valid',
  }),
  password: Joi.string().min(6).max(255).optional().messages({
    'string.min': 'Password minimal 6 karakter',
    'string.max': 'Password maksimal 255 karakter',
  }),
  role: Joi.string()
    .valid('ADMIN', 'RISK_MANAGER', 'RISK_OWNER')
    .optional()
    .messages({
      'any.only': 'Role harus salah satu dari: ADMIN, RISK_MANAGER, RISK_OWNER',
    }),
  division_id: Joi.string().uuid().optional().messages({
    'string.guid': 'Division ID harus berupa UUID',
  }),
});
