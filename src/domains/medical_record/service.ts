import mongoose from 'mongoose';
import { MedicalRecord, IMedicalRecord } from './model';
import { MedicalRecordRequest } from './dto';

export class MedicalRecordService {
  
  static async createMedicalRecord(data: MedicalRecordRequest): Promise<IMedicalRecord> {
    try {
      const recordData = {
        ...data,
        animal_id: new mongoose.Types.ObjectId(data.animal_id),
      };

      const medicalRecord = new MedicalRecord(recordData);
      const savedRecord = await medicalRecord.save();
      
      return savedRecord;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new Error(`Invalid data format: ${error.message}`);
      }
      throw new Error(`Failed to create medical record: ${error}`);
    }
  }

  static async getMedicalRecordById(recordId: string): Promise<IMedicalRecord | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(recordId);
      const medicalRecord = await MedicalRecord.findById(objectId)
        .populate('animal_id', 'name species microchip_id');
      
      return medicalRecord;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Invalid medical record ID format');
      }
      throw new Error(`Failed to retrieve medical record: ${error}`);
    }
  }

  static async getMedicalRecordsByAnimalId(animalId: string, page = 1, limit = 10): Promise<{
    medicalRecords: IMedicalRecord[];
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

      const [medicalRecords, total] = await Promise.all([
        MedicalRecord.find({ animal_id: objectId })
          .sort({ examination_date: -1 })
          .skip(skip)
          .limit(limit)
          .populate('animal_id', 'name species microchip_id'),
        MedicalRecord.countDocuments({ animal_id: objectId })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        medicalRecords,
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
      throw new Error(`Failed to retrieve medical records: ${error}`);
    }
  }
}