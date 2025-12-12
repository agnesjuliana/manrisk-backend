import Joi from 'joi';

/**
 * Schema Joi untuk create user
 */
export const createUserJoiSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email tidak valid',
  }),
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama minimal 3 karakter',
    'string.max': 'Nama maksimal 255 karakter',
  }),
  role: Joi.string()
    .valid('ADMIN', 'RISK_MANAGER', 'RISK_OWNER')
    .required()
    .messages({
      'string.only': 'Role harus ADMIN, RISK_MANAGER, atau RISK_OWNER',
    }),
  departmentId: Joi.string().uuid().optional().messages({
    'string.guid': 'Department ID harus UUID yang valid',
  }),
});

export interface CreateUserRequest {
  email: string;
  name: string;
  role: 'ADMIN' | 'RISK_MANAGER' | 'RISK_OWNER';
  departmentId?: string;
}

/**
 * Schema Joi untuk update user
 */
export const updateUserJoiSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'Email tidak valid',
  }),
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Nama minimal 3 karakter',
    'string.max': 'Nama maksimal 255 karakter',
  }),
  role: Joi.string()
    .valid('ADMIN', 'RISK_MANAGER', 'RISK_OWNER')
    .optional()
    .messages({
      'string.only': 'Role harus ADMIN, RISK_MANAGER, atau RISK_OWNER',
    }),
  departmentId: Joi.string().uuid().optional().messages({
    'string.guid': 'Department ID harus UUID yang valid',
  }),
});

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'RISK_MANAGER' | 'RISK_OWNER';
  departmentId?: string;
}

/**
 * Schema Joi untuk set password
 */
export const setPasswordJoiSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password minimal 8 karakter',
  }),
  confirmPassword: Joi.string().min(8).required().valid(Joi.ref('password')).messages({
    'string.min': 'Password minimal 8 karakter',
    'any.only': 'Password dan konfirmasi password tidak cocok',
  }),
});

export interface SetPasswordRequest {
  password: string;
  confirmPassword: string;
}

/**
 * Grouped schema for easier import
 */
export const manageUserJoiSchema = createUserJoiSchema;
