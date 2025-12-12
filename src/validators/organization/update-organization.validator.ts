import Joi from 'joi';

/**
 * Schema Joi untuk update organization profile
 */
export const updateOrganizationJoiSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Nama organisasi minimal 3 karakter',
    'string.max': 'Nama organisasi maksimal 255 karakter',
  }),
  address: Joi.string().min(5).max(500).optional().messages({
    'string.min': 'Alamat minimal 5 karakter',
    'string.max': 'Alamat maksimal 500 karakter',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email organisasi tidak valid',
  }),
  noTelp: Joi.string().min(10).max(15).optional().messages({
    'string.min': 'Nomor telepon minimal 10 karakter',
    'string.max': 'Nomor telepon maksimal 15 karakter',
  }),
});

export interface UpdateOrganizationRequest {
  name?: string;
  address?: string;
  email?: string;
  noTelp?: string;
}
