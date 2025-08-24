import { AuthenticatedRequest } from '../../middleware/jwt';
import { Router, Response } from 'express';
import { AnalyticsService } from './service';

const analyticsRouter = Router();

// GET /overview - Get real-time analytics overview with today's activities
analyticsRouter.get('/overview', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const analyticsData = await AnalyticsService.getOverviewStats();
    
    res.json({
      message: 'Real-time analytics retrieved successfully',
      data: analyticsData.totals,
      todayActivities: analyticsData.todayActivities,
      generatedAt: analyticsData.generatedAt
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve analytics overview',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default analyticsRouter;