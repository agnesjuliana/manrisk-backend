import Joi from 'joi';

export const createSOASchema = Joi.object({
  controlId: Joi.string().required().messages({
    'any.required': 'Control ID harus diisi',
    'string.empty': 'Control ID tidak boleh kosong',
  }),
  managerId: Joi.string().optional().allow(null).messages({
    'string.empty': 'Manager ID tidak boleh kosong',
  }),
  status: Joi.string()
    .valid('BELUM_DITENTUKAN', 'RELEVAN', 'TIDAK_RELEVAN', 'DIHENTIKAN')
    .optional()
    .messages({
      'any.only': 'Status hanya bisa BELUM_DITENTUKAN, RELEVAN, TIDAK_RELEVAN, atau DIHENTIKAN',
    }),
  notes: Joi.string().optional().allow(null),
  targetDate: Joi.date().optional().allow(null),
});

export const updateSOASchema = Joi.object({
  controlId: Joi.string().optional(),
  managerId: Joi.string().optional(),
  status: Joi.string()
    .valid('BELUM_DITENTUKAN', 'RELEVAN', 'TIDAK_RELEVAN', 'DIHENTIKAN')
    .optional()
    .messages({
      'any.only': 'Status hanya bisa BELUM_DITENTUKAN, RELEVAN, TIDAK_RELEVAN, atau DIHENTIKAN',
    }),
  implementationStatus: Joi.string()
    .valid('DIRENCANAKAN', 'DALAM_IMPLEMENTASI', 'DIIMPLEMENTASIKAN', 'DIHENTIKAN')
    .optional()
    .messages({
      'any.only': 'Implementation Status hanya bisa DIRENCANAKAN, DALAM_IMPLEMENTASI, DIIMPLEMENTASIKAN, atau DIHENTIKAN',
    }),
  notes: Joi.string().optional().allow(null),
  targetDate: Joi.date().optional().allow(null),
});
