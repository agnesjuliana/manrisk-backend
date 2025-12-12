import Joi from 'joi';

export const registerOrganizationJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama organisasi minimal 3 karakter',
    'string.max': 'Nama organisasi maksimal 255 karakter',
    'any.required': 'Nama organisasi wajib diisi',
  }),
  address: Joi.string().min(5).max(500).required().messages({
    'string.min': 'Alamat minimal 5 karakter',
    'string.max': 'Alamat maksimal 500 karakter',
    'any.required': 'Alamat wajib diisi',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email organisasi tidak valid',
    'any.required': 'Email organisasi wajib diisi',
  }),
  noTelp: Joi.string().min(10).max(15).required().messages({
    'string.min': 'Nomor telepon minimal 10 karakter',
    'string.max': 'Nomor telepon maksimal 15 karakter',
    'any.required': 'Nomor telepon wajib diisi',
  }),
});

export interface RegisterOrganizationRequest {
  name: string;
  address: string;
  email: string;
  noTelp: string;
}

