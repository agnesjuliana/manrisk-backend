import Joi from 'joi';

export const createRiskCriteriaSchema = Joi.object({
  isFMEA: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'isFMEA harus boolean',
      'any.required': 'isFMEA tidak boleh kosong',
    }),
  scale: Joi.number()
    .required()
    .integer()
    .positive()
    .messages({
      'number.base': 'scale harus number',
      'number.integer': 'scale harus berupa integer',
      'number.positive': 'scale harus lebih dari 0',
      'any.required': 'scale tidak boleh kosong',
    }),
  threshold: Joi.number()
    .required()
    .integer()
    .positive()
    .messages({
      'number.base': 'threshold harus number',
      'number.integer': 'threshold harus berupa integer',
      'number.positive': 'threshold harus lebih dari 0',
      'any.required': 'threshold tidak boleh kosong',
    }),
});

export const updateRiskCriteriaSchema = Joi.object({
  isFMEA: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isFMEA harus boolean',
    }),
  scale: Joi.number()
    .optional()
    .integer()
    .positive()
    .messages({
      'number.base': 'scale harus number',
      'number.integer': 'scale harus berupa integer',
      'number.positive': 'scale harus lebih dari 0',
    }),
  threshold: Joi.number()
    .optional()
    .integer()
    .positive()
    .messages({
      'number.base': 'threshold harus number',
      'number.integer': 'threshold harus berupa integer',
      'number.positive': 'threshold harus lebih dari 0',
    }),
});
