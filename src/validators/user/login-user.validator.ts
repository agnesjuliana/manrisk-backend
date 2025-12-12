import Joi from 'joi';

export const loginUserJoiSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email tidak valid',
      'any.required': 'Email wajib diisi',
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password wajib diisi',
    }),
});
