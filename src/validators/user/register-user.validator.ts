import Joi from 'joi';

/**
 * Joi Schema untuk register user baru
 * Validasi: email format, password strength (min 8 char), name min 3 char
 */
export const registerUserJoiSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email tidak valid',
      'any.required': 'Email wajib diisi',
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password minimal 8 karakter',
      'any.required': 'Password wajib diisi',
    }),

  name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.min': 'Nama minimal 3 karakter',
      'string.max': 'Nama maksimal 255 karakter',
      'any.required': 'Nama wajib diisi',
    }),
});