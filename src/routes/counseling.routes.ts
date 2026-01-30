import { Router } from 'express';
import * as sessionController from '../controllers/session.controller';
import * as agreementController from '../controllers/agreement.controller';

const router = Router();

// Counseling Sessions
router.get('/sessions', sessionController.getSessions);
router.post('/sessions', sessionController.createSession);
router.get('/sessions/:id', sessionController.getSessionById);
router.put('/sessions/:id', sessionController.updateSession);

// Agreements
router.post('/agreements', agreementController.createAgreement);
router.put('/agreements/:id', agreementController.updateAgreementStatus);

// Communications
router.post('/communications', agreementController.addParentComm);

export default router;
