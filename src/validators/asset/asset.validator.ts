import Joi from 'joi';

export const createAssetSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Nama asset tidak boleh kosong',
    'any.required': 'Nama asset harus diisi',
  }),
  location: Joi.string().optional().allow(null, ''),
  type: Joi.object({
    id: Joi.string().optional().allow(null, ''),
    name: Joi.string().required().messages({
      'string.empty': 'Nama type asset tidak boleh kosong',
      'any.required': 'Nama type asset harus diisi',
    }),
  })
    .required()
    .messages({
      'any.required': 'Type asset harus diisi',
    }),
  classification: Joi.object({
    id: Joi.string().optional().allow(null, ''),
    name: Joi.string().required().messages({
      'string.empty': 'Nama klasifikasi asset tidak boleh kosong',
      'any.required': 'Nama klasifikasi asset harus diisi',
    }),
  })
    .required()
    .messages({
      'any.required': 'Klasifikasi asset harus diisi',
    }),
}).unknown(true);

export const updateAssetSchema = Joi.object({
  name: Joi.string().optional(),
  location: Joi.string().optional().allow(null, ''),
  ownerId: Joi.string().optional(),
  typeId: Joi.string().optional(),
  type: Joi.object({
    id: Joi.string().optional().allow(null, ''),
    name: Joi.string().required().messages({
      'string.empty': 'Nama type asset tidak boleh kosong',
      'any.required': 'Nama type asset harus diisi',
    }),
  }).optional(),
  classificationId: Joi.string().optional(),
  classification: Joi.object({
    id: Joi.string().optional().allow(null, ''),
    name: Joi.string().required().messages({
      'string.empty': 'Nama klasifikasi asset tidak boleh kosong',
      'any.required': 'Nama klasifikasi asset harus diisi',
    }),
  }).optional(),
  status: Joi.string()
    .optional()
    .valid(
      'DRAFT',
      'MENUNGGU_PERSETUJUAN_RM',
      'MENUNGGU_PERSETUJUAN_FINAL',
      'REVISI',
      'DISETUJUI',
      'DITOLAK',
    ),
}).unknown(true);
