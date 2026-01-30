import { Request, Response } from 'express';
import { AuthRequest } from '../types/express';
import prisma from '../config/prisma';
import { sendResponse, sendError } from '../utils/response';
import { createSessionSchema, updateSessionSchema } from '../validators/counseling.validator';

export const getSessions = async (req: Request, res: Response) => {
  const offset = parseInt(req.headers['x-paging-offset'] as string) || 0;
  const limit = parseInt(req.headers['x-paging-limit'] as string) || 20;
  const studentId = req.query.studentId as string;
  const counselorId = req.query.counselorId as string;

  const where = {
    ...(studentId && { studentId }),
    ...(counselorId && { counselorId }),
  };

  const [items, total] = await Promise.all([
    prisma.counselingSession.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { sessionDate: 'desc' },
      include: {
        agreements: true,
      },
    }),
    prisma.counselingSession.count({ where }),
  ]);

  return sendResponse(res, 200, true, 'Sessions retrieved', {
    items,
    pagination: { offset, limit, total },
  });
};

export const createSession = async (req: AuthRequest, res: Response) => {
  const { error, value } = createSessionSchema.validate(req.body);
  if (error) return sendError(res, 400, error.details[0].message);

  const session = await prisma.counselingSession.create({
    data: {
      ...value,
      counselorId: req.user?.id || 'SYSTEM',
      counselorName: req.user?.name || 'BK Counselor',
      createdBy: req.user?.id || 'SYSTEM',
    },
  });

  return sendResponse(res, 201, true, 'Session created successfully', session);
};

export const updateSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error, value } = updateSessionSchema.validate(req.body);
  if (error) return sendError(res, 400, error.details[0].message);

  const updated = await prisma.counselingSession.update({
    where: { id },
    data: value,
  });

  return sendResponse(res, 200, true, 'Session updated', updated);
};

export const getSessionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await prisma.counselingSession.findUnique({
    where: { id },
    include: {
      agreements: true,
      communications: true,
    },
  });

  if (!item) return sendError(res, 404, 'Session not found');

  return sendResponse(res, 200, true, 'Session detail retrieved', item);
};
