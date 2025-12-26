import Joi from 'joi';

export const upsertScaleStatusSchema = Joi.object({
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
  scale_status: Joi.array()
    .items(
      Joi.string()
        .required()
        .messages({
          'string.base': 'setiap item scale_status harus string',
          'any.required': 'scale_status tidak boleh kosong',
        }),
    )
    .required()
    .min(1)
    .messages({
      'array.base': 'scale_status harus berupa array',
      'array.min': 'scale_status minimal harus memiliki 1 item',
      'any.required': 'scale_status tidak boleh kosong',
    }),
});
