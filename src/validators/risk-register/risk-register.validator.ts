import Joi from 'joi';

export const createRiskRegisterSchema = Joi.object({
  assetId: Joi.string().optional().allow(null, ''),
  contextId: Joi.string().optional().allow(null, ''),
  ownerId: Joi.string().optional().allow(null, ''),
  riskcategory: Joi.object({
    id: Joi.string().optional().allow(null, ''),
    name: Joi.string().required().messages({
      'string.empty': 'Nama risk category tidak boleh kosong',
      'any.required': 'Nama risk category harus diisi',
    }),
  })
    .required()
    .messages({
      'any.required': 'Risk category harus diisi',
    }),
  source: Joi.object({
    id: Joi.string().optional().allow(null, ''),
    name: Joi.string().required().messages({
      'string.empty': 'Nama risk source tidak boleh kosong',
      'any.required': 'Nama risk source harus diisi',
    }),
  })
    .required()
    .messages({
      'any.required': 'Risk source harus diisi',
    }),
  customRiskId: Joi.string().required().messages({
    'any.required': 'Custom Risk ID harus diisi',
    'string.base': 'Custom Risk ID harus berupa string',
  }),
  vulnerability: Joi.string().required().messages({
    'any.required': 'Vulnerability harus diisi',
    'string.base': 'Vulnerability harus berupa string',
  }),
  threat: Joi.string().required().messages({
    'any.required': 'Threat harus diisi',
    'string.base': 'Threat harus berupa string',
  }),
  identifiedRisk: Joi.string().required().messages({
    'any.required': 'Identified Risk harus diisi',
    'string.base': 'Identified Risk harus berupa string',
  }),
  detail: Joi.string().optional().allow(null, ''),
  isConfidentiality: Joi.boolean().optional().default(false),
  isIntegrity: Joi.boolean().optional().default(false),
  isAvailability: Joi.boolean().optional().default(false),
  impactSeverity: Joi.number().optional().allow(null),
  likelihoodOccurence: Joi.number().optional().allow(null),
  detection: Joi.number().optional().allow(null),
}).unknown(true);

export const updateRiskRegisterSchema = Joi.object({
  assetId: Joi.string().optional().allow(null, ''),
  contextId: Joi.string().optional().allow(null, ''),
  ownerId: Joi.string().optional().allow(null, ''),
  riskcategory: Joi.object({
    id: Joi.string().optional().allow(null, ''),
    name: Joi.string().required().messages({
      'string.empty': 'Nama risk category tidak boleh kosong',
      'any.required': 'Nama risk category harus diisi',
    }),
  }).optional(),
  source: Joi.object({
    id: Joi.string().optional().allow(null, ''),
    name: Joi.string().required().messages({
      'string.empty': 'Nama risk source tidak boleh kosong',
      'any.required': 'Nama risk source harus diisi',
    }),
  }).optional(),
  customRiskId: Joi.string().optional().messages({
    'string.base': 'Custom Risk ID harus berupa string',
  }),
  vulnerability: Joi.string().optional().messages({
    'string.base': 'Vulnerability harus berupa string',
  }),
  threat: Joi.string().optional().messages({
    'string.base': 'Threat harus berupa string',
  }),
  identifiedRisk: Joi.string().optional().messages({
    'string.base': 'Identified Risk harus berupa string',
  }),
  detail: Joi.string().optional().allow(null, ''),
  isConfidentiality: Joi.boolean().optional(),
  isIntegrity: Joi.boolean().optional(),
  isAvailability: Joi.boolean().optional(),
  impactSeverity: Joi.number().optional().allow(null),
  likelihoodOccurence: Joi.number().optional().allow(null),
  detection: Joi.number().optional().allow(null),
  status: Joi.string()
    .optional()
    .valid('DRAFT', 'MENUNGGU_PERSETUJUAN_RM', 'DISETUJUI_RM', 'MENUNGGU_PERSETUJUAN_FINAL', 'REVISI', 'DISETUJUI', 'DITOLAK')
    .messages({
      'any.only': 'Status harus salah satu dari: DRAFT, MENUNGGU_PERSETUJUAN_RM, DISETUJUI_RM, MENUNGGU_PERSETUJUAN_FINAL, REVISI, DISETUJUI, DITOLAK',
    }),
}).unknown(true);
