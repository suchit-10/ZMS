import { Router, Request, Response } from 'express';
import { JWTMiddleware } from '../middleware/jwt';
import authRoutes from '../domains/auth/routes';
import userRoutes from '../domains/users/routes';
import onboardRoutes from '../domains/onboard';

const apiRouter = Router();
const protectedRouter = Router();

apiRouter.use('/auth', authRoutes);

protectedRouter.use(JWTMiddleware);
protectedRouter.use('/users', userRoutes);
protectedRouter.use('/onboard',onboardRoutes)

apiRouter.use(protectedRouter);

apiRouter.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

export default apiRouter;