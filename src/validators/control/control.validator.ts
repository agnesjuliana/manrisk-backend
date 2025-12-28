import Joi from 'joi';

export const createControlSchema = Joi.object({
  code: Joi.string().required().messages({
    'any.required': 'Code harus diisi',
    'string.empty': 'Code tidak boleh kosong',
  }),
  category: Joi.string().optional().allow(null),
  title: Joi.string().required().messages({
    'any.required': 'Title harus diisi',
    'string.empty': 'Title tidak boleh kosong',
  }),
  description: Joi.string().optional().allow(null),
  isAnnex: Joi.boolean().optional().default(false),
});

export const updateControlSchema = Joi.object({
  code: Joi.string().optional(),
  category: Joi.string().optional().allow(null),
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(null),
  isAnnex: Joi.boolean().optional(),
});
