import Joi from 'joi';

export const createRiskRegisterRevisionSchema = Joi.object({
  riskId: Joi.string().required().messages({
    'any.required': 'Risk ID harus diisi',
    'string.empty': 'Risk ID tidak boleh kosong',
  }),
  impactSeverity: Joi.number().integer().required().messages({
    'any.required': 'Impact Severity harus diisi',
  }),
  likelihoodOccurence: Joi.number().integer().required().messages({
    'any.required': 'Likelihood Occurence harus diisi',
  }),
  detection: Joi.number().integer().required().messages({
    'any.required': 'Detection harus diisi',
  }),
});

export const updateRiskRegisterRevisionSchema = Joi.object({
  impactSeverity: Joi.number().integer().optional(),
  likelihoodOccurence: Joi.number().integer().optional(),
  detection: Joi.number().integer().optional(),
  isApprovedByOwner: Joi.boolean().optional(),
});
