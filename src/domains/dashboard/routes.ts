import { AuthenticatedRequest } from '../../middleware/jwt';
import { Router, Response } from 'express';
import { validateData } from '../../core/validation';
import { 
  DashboardQuerySchema,
  DashboardQuery
} from './dto';
import { ZooDashboardModel } from './model';

const dashboardRouter = Router();

dashboardRouter.get('/latest', async (req: AuthenticatedRequest, res: Response) => {
  const queryValidation = validateData<DashboardQuery>(req.query, DashboardQuerySchema);
  
  if (!queryValidation.success) {
    res.status(400).json({
      message: 'Invalid query parameters',
      errors: queryValidation.errors
    });
    return;
  }

  try {
    const latestDashboard = await ZooDashboardModel.findOne().sort({ generatedAt: -1 }).exec();

    if (!latestDashboard) {
      res.status(404).json({
        message: 'No dashboard snapshot found'
      });
      return;
    }

    res.json({
      message: 'Dashboard retrieved successfully',
      data: latestDashboard
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve dashboard',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default dashboardRouter;