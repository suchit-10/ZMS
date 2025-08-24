import { ZooDashboardModel, IZooDashboard } from './model';

export class DashboardService {
  static async getLatestDashboard(): Promise<IZooDashboard | null> {
    try {
      const latestDashboard = await ZooDashboardModel.findOne()
        .sort({ generatedAt: -1 }) // get the latest snapshot
        .populate('medicalStatus.recentActivities.animalId', 'name species microchip_id')
        .populate('feedingDiet.dailySchedules.animalId', 'name species')
        .populate('activitiesAlerts.recentActivities.animalId', 'name species')
        .populate('activitiesAlerts.urgentAlerts.animalId', 'name species')
        .exec();

      return latestDashboard;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Failed to retrieve latest dashboard: ${error.message}`
          : 'Failed to retrieve latest dashboard: Unknown error'
      );
    }
  }
}
