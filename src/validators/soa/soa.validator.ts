import Joi from 'joi';

export const createSOASchema = Joi.object({
  controlId: Joi.string().required().messages({
    'any.required': 'Control ID harus diisi',
    'string.empty': 'Control ID tidak boleh kosong',
  }),
  managerId: Joi.string().required().messages({
    'any.required': 'Manager ID harus diisi',
    'string.empty': 'Manager ID tidak boleh kosong',
  }),
  status: Joi.string()
    .valid('BELUM_DITENTUKAN', 'RELEVAN', 'TIDAK_RELEVANL', 'DIHENTIKAN')
    .optional()
    .messages({
      'any.only': 'Status hanya bisa BELUM_DITENTUKAN, RELEVAN, TIDAK_RELEVANL, atau DIHENTIKAN',
    }),
  notes: Joi.string().optional().allow(null),
  targetDate: Joi.date().optional().allow(null),
});

export const updateSOASchema = Joi.object({
  controlId: Joi.string().optional(),
  managerId: Joi.string().optional(),
  status: Joi.string()
    .valid('BELUM_DITENTUKAN', 'RELEVAN', 'TIDAK_RELEVANL', 'DIHENTIKAN')
    .optional()
    .messages({
      'any.only': 'Status hanya bisa BELUM_DITENTUKAN, RELEVAN, TIDAK_RELEVANL, atau DIHENTIKAN',
    }),
  notes: Joi.string().optional().allow(null),
  targetDate: Joi.date().optional().allow(null),
});
