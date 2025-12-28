import Joi from 'joi';

export const createRiskApprovalSchema = Joi.object({
  message: Joi.string().optional().allow(null, ''),
  riskIds: Joi.array()
    .items(Joi.string().required())
    .required()
    .messages({
      'any.required': 'Risk IDs harus diisi',
      'array.base': 'Risk IDs harus berupa array',
    }),
}).unknown(true);

export const updateRiskApprovalSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid('MENUNGGU_PERSETUJUAN_FINAL', 'DITOLAK', 'DISETUJUI')
    .messages({
      'any.required': 'Status harus diisi',
      'any.only': 'Status harus salah satu dari: MENUNGGU_PERSETUJUAN_FINAL, DITOLAK, DISETUJUI',
    }),
}).unknown(true);
