import { Router, Request, Response } from 'express';
import { JWTMiddleware } from '../middleware/jwt';
import authRoutes from '../domains/auth/routes';
import userRoutes from '../domains/users/routes';
import onboardRoutes from '../domains/onboard';
import observationRoutes from '../domains/observations/routes';
import medicalRecordRoutes from '../domains/medical_record/routes';

const apiRouter = Router();
const protectedRouter = Router();

apiRouter.use('/auth', authRoutes);

protectedRouter.use(JWTMiddleware);
protectedRouter.use('/users', userRoutes);
protectedRouter.use('/onboard', onboardRoutes);
protectedRouter.use('/observations', observationRoutes);
protectedRouter.use('/medical-records', medicalRecordRoutes);

apiRouter.use(protectedRouter);

apiRouter.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

export default apiRouter;