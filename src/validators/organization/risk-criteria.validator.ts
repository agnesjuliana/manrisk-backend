import Joi from 'joi';

export const createRiskCriteriaSchema = Joi.object({
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
}).min(1).messages({
  'object.min': 'Minimal harus ada satu field yang dikirim (isFMEA, scale, atau threshold)',
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
