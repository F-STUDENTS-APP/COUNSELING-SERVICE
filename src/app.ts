import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import dotenv from 'dotenv';
import logger from './config/logger';
import { sendError } from './utils/response';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import counselingRoutes from './routes/counseling.routes';

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

dotenv.config();

const app = express();
const port = process.env.PORT || 3009;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/counseling', counselingRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', service: 'counseling-service' });
});

// Error handling
app.use(
  (err: Error & { statusCode?: number }, req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.stack);
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    sendError(res, status, message);
  }
);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Counseling Service listening on port ${port}`);
  });
}

export default app;
