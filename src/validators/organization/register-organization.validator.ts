import Joi from 'joi';

/**
 * Schema Joi untuk register organization dengan admin user
 */
export const registerOrganizationJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama organisasi minimal 3 karakter',
    'string.max': 'Nama organisasi maksimal 255 karakter',
  }),
  address: Joi.string().min(5).max(500).required().messages({
    'string.min': 'Alamat minimal 5 karakter',
    'string.max': 'Alamat maksimal 500 karakter',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email organisasi tidak valid',
  }),
  noTelp: Joi.string().min(10).max(15).required().messages({
    'string.min': 'Nomor telepon minimal 10 karakter',
    'string.max': 'Nomor telepon maksimal 15 karakter',
  }),
  adminName: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Nama admin minimal 3 karakter',
    'string.max': 'Nama admin maksimal 255 karakter',
  }),
  adminEmail: Joi.string().email().required().messages({
    'string.email': 'Email admin tidak valid',
  }),
  adminPassword: Joi.string().min(8).required().messages({
    'string.min': 'Password minimal 8 karakter',
  }),
});

export interface RegisterOrganizationRequest {
  name: string;
  address: string;
  email: string;
  noTelp: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}
