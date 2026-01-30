import Joi from 'joi';

export const createSessionSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  studentName: Joi.string().required(),
  studentClass: Joi.string().required(),
  sessionDate: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  type: Joi.string().valid('INDIVIDUAL', 'GROUP', 'WALK_IN').default('INDIVIDUAL'),
  category: Joi.string()
    .valid('DISCIPLINARY', 'ACADEMIC', 'CAREER', 'PERSONAL')
    .default('DISCIPLINARY'),
  subject: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  needsAgreement: Joi.boolean().default(false),
  needsParentCall: Joi.boolean().default(false),
});

export const updateSessionSchema = Joi.object({
  outcome: Joi.string().max(2000).optional(),
  status: Joi.string().valid('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW').optional(),
  sessionDate: Joi.date().optional(),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  needsAgreement: Joi.boolean().optional(),
  needsParentCall: Joi.boolean().optional(),
});

export const createAgreementSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
  studentId: Joi.string().uuid().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  validUntil: Joi.date().optional(),
});

export const parentCommSchema = Joi.object({
  sessionId: Joi.string().uuid().optional(),
  studentId: Joi.string().uuid().required(),
  parentName: Joi.string().required(),
  method: Joi.string()
    .valid('WHATSAPP', 'PHONE_CALL', 'IN_PERSON', 'EMAIL', 'HOME_VISIT')
    .required(),
  subject: Joi.string().required(),
  notes: Joi.string().required(),
  result: Joi.string().optional(),
});
