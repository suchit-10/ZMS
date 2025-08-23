import mongoose from 'mongoose';
import { BehavioralObservation, IBehavioralObservation } from './model';
import { ObservationRequest } from './dto';

export class ObservationService {
  
  static async createObservation(data: ObservationRequest): Promise<IBehavioralObservation> {
    try {
      const observationData = {
        ...data,
        animal_id: new mongoose.Types.ObjectId(data.animal_id),
        observer_staff_id: data.observer_staff_id ? new mongoose.Types.ObjectId(data.observer_staff_id) : undefined,
      };

      const observation = new BehavioralObservation(observationData);
      const savedObservation = await observation.save();
      
      return savedObservation;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new Error(`Invalid data format: ${error.message}`);
      }
      throw new Error(`Failed to create observation: ${error}`);
    }
  }

  static async getObservationById(observationId: string): Promise<IBehavioralObservation | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(observationId);
      const observation = await BehavioralObservation.findById(objectId);
      
      return observation
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Invalid observation ID format');
      }
      throw new Error(`Failed to retrieve observation: ${error}`);
    }
  }

  static async getObservationsByAnimalId(animalId: string, page = 1, limit = 10): Promise<{
    observations: IBehavioralObservation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const objectId = new mongoose.Types.ObjectId(animalId);
      const skip = (page - 1) * limit;

      const [observations, total] = await Promise.all([
        BehavioralObservation.find({ animal_id: objectId })
          .sort({ observation_at: -1 })
          .skip(skip)
          .limit(limit)
          .populate('animal_id', 'name species microchip_id')
          .populate('observer_staff_id', 'name employee_id'),
        BehavioralObservation.countDocuments({ animal_id: objectId })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        observations,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Invalid animal ID format');
      }
      throw new Error(`Failed to retrieve observations: ${error}`);
    }
  }
}