import Joi from 'joi';

export const createTreatmentSchema = Joi.object({
  riskId: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
    'any.required': 'Risk ID harus diisi',
    'string.guid': 'Risk ID harus format UUID',
  }),
  picId: Joi.string().uuid({ version: 'uuidv4' }).required().messages({
    'any.required': 'PIC ID harus diisi',
    'string.guid': 'PIC ID harus format UUID',
  }),
  treatmentOpt: Joi.string()
    .valid('MITIGATE', 'ACCEPT', 'AVOID', 'TRANSFER')
    .required()
    .messages({
      'any.required': 'Treatment option harus diisi',
      'any.only': 'Treatment option hanya bisa MITIGATE, ACCEPT, AVOID, atau TRANSFER',
    }),
  impactSeverityTarget: Joi.number().integer().positive().optional(),
  likelihoodOccurenceTarget: Joi.number().integer().positive().optional(),
  detectionTarget: Joi.number().integer().positive().optional(),
  actionReason: Joi.string().max(500).optional().allow(null),
  detailedActionPlan: Joi.string().min(1).max(2000).required().messages({
    'any.required': 'Detailed action plan harus diisi',
    'string.empty': 'Detailed action plan tidak boleh kosong',
  }),
  startAction: Joi.date().required().messages({
    'any.required': 'Start action date harus diisi',
    'date.base': 'Start action harus berupa tanggal yang valid',
  }),
  endAction: Joi.date().required().messages({
    'any.required': 'End action date harus diisi',
    'date.base': 'End action harus berupa tanggal yang valid',
  }),
  notes: Joi.string().max(1000).optional().allow(null),
  controlIds: Joi.array().items(Joi.string().uuid({ version: 'uuidv4' })).min(1).required().messages({
    'any.required': 'Control IDs harus diisi',
    'array.min': 'Minimal satu control harus dipilih',
  }),
});

export const updateTreatmentSchema = Joi.object({
  picId: Joi.string().uuid({ version: 'uuidv4' }).optional(),
  treatmentOpt: Joi.string()
    .valid('MITIGATE', 'ACCEPT', 'AVOID', 'TRANSFER')
    .optional()
    .messages({
      'any.only': 'Treatment option hanya bisa MITIGATE, ACCEPT, AVOID, atau TRANSFER',
    }),
  impactSeverityTarget: Joi.number().integer().positive().optional(),
  likelihoodOccurenceTarget: Joi.number().integer().positive().optional(),
  detectionTarget: Joi.number().integer().positive().optional(),
  actionReason: Joi.string().max(500).optional().allow(null),
  detailedActionPlan: Joi.string().min(1).max(2000).optional(),
  startAction: Joi.date().optional(),
  endAction: Joi.date().optional(),
  notes: Joi.string().max(1000).optional().allow(null),
  isApprovedByTop: Joi.boolean().optional(),
  controlIds: Joi.array().items(Joi.string().uuid({ version: 'uuidv4' })).optional(),
});
