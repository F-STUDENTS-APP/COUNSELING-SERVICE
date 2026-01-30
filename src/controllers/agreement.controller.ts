import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { sendResponse, sendError } from '../utils/response';
import { createAgreementSchema, parentCommSchema } from '../validators/counseling.validator';

export const createAgreement = async (req: Request, res: Response) => {
  const { error, value } = createAgreementSchema.validate(req.body);
  if (error) return sendError(res, 400, error.details[0].message);

  const agreement = await prisma.coachingAgreement.create({
    data: value,
  });

  return sendResponse(res, 201, true, 'Agreement created', agreement);
};

export const updateAgreementStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, studentSigned, parentSigned, schoolSigned, fileUrl } = req.body;

  const updated = await prisma.coachingAgreement.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(studentSigned !== undefined && {
        studentSigned,
        studentSignedAt: studentSigned ? new Date() : null,
      }),
      ...(parentSigned !== undefined && {
        parentSigned,
        parentSignedAt: parentSigned ? new Date() : null,
      }),
      ...(schoolSigned !== undefined && {
        schoolSigned,
        schoolSignedAt: schoolSigned ? new Date() : null,
      }),
      ...(fileUrl && { fileUrl }),
    },
  });

  return sendResponse(res, 200, true, 'Agreement status updated', updated);
};

export const addParentComm = async (req: Request, res: Response) => {
  const { error, value } = parentCommSchema.validate(req.body);
  if (error) return sendError(res, 400, error.details[0].message);

  const comm = await prisma.parentCommunication.create({
    data: value,
  });

  return sendResponse(res, 201, true, 'Parent communication recorded', comm);
};
