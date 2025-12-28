import Joi from 'joi';

export const createAssetApprovalSchema = Joi.object({
  message: Joi.string().optional().allow(null, ''),
  assetIds: Joi.array()
    .items(Joi.string().required())
    .required()
    .min(1)
    .messages({
      'array.base': 'Asset IDs harus berupa array',
      'array.min': 'Minimal ada 1 aset yang dipilih',
      'any.required': 'Asset IDs harus diisi',
    }),
}).unknown(true);

export const updateAssetApprovalSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid('MENUNGGU_PERSETUJUAN_FINAL', 'DISETUJUI', 'DITOLAK')
    .messages({
      'any.required': 'Status harus diisi',
      'any.only': 'Status harus salah satu dari: MENUNGGU_PERSETUJUAN_FINAL, DISETUJUI, DITOLAK',
    }),
}).unknown(true);
