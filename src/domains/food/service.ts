import mongoose from 'mongoose';
import { FeedingRecord, IFeedingRecord } from './feeding_record';
import { FeedingRecordRequest } from './dto';

export class FeedingRecordService {
  
  static async createFeedingRecord(data: FeedingRecordRequest, userId: string): Promise<IFeedingRecord> {
    try {
      const recordData = {
        ...data,
        animal_id: new mongoose.Types.ObjectId(data.animal_id),
        staff_id: data.staff_id ? new mongoose.Types.ObjectId(data.staff_id) : new mongoose.Types.ObjectId(userId),
      };

      const feedingRecord = new FeedingRecord(recordData);
      const savedRecord = await feedingRecord.save();
      
      return savedRecord;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new Error(`Invalid data format: ${error.message}`);
      }
      throw new Error(`Failed to create feeding record: ${error}`);
    }
  }

  static async getFeedingRecordById(recordId: string): Promise<IFeedingRecord | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(recordId);
      const feedingRecord = await FeedingRecord.findById(objectId)
        .populate('animal_id', 'name species microchip_id')
        .populate('staff_id', 'username');
      
      return feedingRecord;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Invalid feeding record ID format');
      }
      throw new Error(`Failed to retrieve feeding record: ${error}`);
    }
  }

  static async getFeedingRecordsByAnimalId(animalId: string, page = 1, limit = 10): Promise<{
    feedingRecords: IFeedingRecord[];
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

      const [feedingRecords, total] = await Promise.all([
        FeedingRecord.find({ animal_id: objectId })
          .sort({ feeding_at: -1 })
          .skip(skip)
          .limit(limit)
          .populate('animal_id', 'name species microchip_id')
          .populate('staff_id', 'username'),
        FeedingRecord.countDocuments({ animal_id: objectId })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        feedingRecords,
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
      throw new Error(`Failed to retrieve feeding records: ${error}`);
    }
  }
}