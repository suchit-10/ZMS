import mongoose from 'mongoose';
import { Animal } from '../animals/model';
import { User } from '../users/model';
import { MedicalRecord } from '../medical_record/model';
import { BehavioralObservation } from '../observations/model';
import { FeedingRecord } from '../food/feeding_record';

export class AnalyticsService {
  
  static async getOverviewStats(): Promise<{
    totals: {
      animals: number;
      users: number;
      medicalRecords: number;
      observations: number;
      feedingRecords: number;
    };
    todayActivities: {
      animalsOnboarded: {
        count: number;
        details: any[];
      };
      medicalRecords: {
        count: number;
        details: any[];
      };
      observations: {
        count: number;
        details: any[];
      };
      feedingRecords: {
        count: number;
        details: any[];
      };
      newUsers: {
        count: number;
        details: any[];
      };
    };
    generatedAt: Date;
  }> {
    try {
      // Get start of today in UTC
      const startOfToday = new Date();
      startOfToday.setUTCHours(0, 0, 0, 0);

      // Get total counts in parallel
      const [
        totalAnimals,
        totalUsers,
        totalMedicalRecords,
        totalObservations,
        totalFeedingRecords
      ] = await Promise.all([
        Animal.countDocuments(),
        User.countDocuments({ isActive: true }),
        MedicalRecord.countDocuments(),
        BehavioralObservation.countDocuments(),
        FeedingRecord.countDocuments()
      ]);

      // Get today's activities with details in parallel
      const [
        todayAnimals,
        todayMedicalRecords,
        todayObservations,
        todayFeedingRecords,
        todayUsers
      ] = await Promise.all([
        // Animals onboarded today
        Animal.find({ createdAt: { $gte: startOfToday } })
          .select('name species microchipId createdAt')
          .sort({ createdAt: -1 })
          .limit(10),
        
        // Medical records created today
        MedicalRecord.find({ createdAt: { $gte: startOfToday } })
          .populate('animal_id', 'name species microchip_id')
          .select('examination_type veterinarian_name createdAt animal_id')
          .sort({ createdAt: -1 })
          .limit(10),
        
        // Observations recorded today
        BehavioralObservation.find({ createdAt: { $gte: startOfToday } })
          .populate('animal_id', 'name species microchip_id')
          .populate('observer_staff_id', 'username')
          .select('behavior_category severity createdAt animal_id observer_staff_id')
          .sort({ createdAt: -1 })
          .limit(10),
        
        // Feeding records logged today
        FeedingRecord.find({ createdAt: { $gte: startOfToday } })
          .populate('animal_id', 'name species microchip_id')
          .populate('staff_id', 'username')
          .select('diet_item_id quantity_given_grams appetite_rating createdAt animal_id staff_id')
          .sort({ createdAt: -1 })
          .limit(10),
        
        // New users registered today
        User.find({ 
          createdAt: { $gte: startOfToday },
          isActive: true 
        })
          .select('username email createdAt')
          .sort({ createdAt: -1 })
          .limit(10)
      ]);

      // Format today's activities with details
      const animalsOnboardedDetails = todayAnimals.map(animal => ({
        name: animal.name,
        species: animal.species,
        microchipId: animal.microchipId,
        onboardedAt: animal.createdAt
      }));

      const medicalRecordsDetails = todayMedicalRecords.map(record => ({
        animalName: (record.animal_id as any)?.name || 'Unknown',
        animalSpecies: (record.animal_id as any)?.species || 'Unknown',
        examinationType: record.examination_type,
        veterinarian: record.veterinarian_name,
        createdAt: record.createdAt
      }));

      const observationsDetails = todayObservations.map(obs => ({
        animalName: (obs.animal_id as any)?.name || 'Unknown',
        animalSpecies: (obs.animal_id as any)?.species || 'Unknown',
        behaviorCategory: obs.behavior_category,
        severity: obs.severity,
        observerName: (obs.observer_staff_id as any)?.username || 'Unknown',
        createdAt: obs.createdAt
      }));

      const feedingRecordsDetails = todayFeedingRecords.map(record => ({
        animalName: (record.animal_id as any)?.name || 'Unknown',
        animalSpecies: (record.animal_id as any)?.species || 'Unknown',
        dietItem: record.diet_item_id || 'Not specified',
        quantityGiven: record.quantity_given_grams,
        appetiteRating: record.appetite_rating,
        staffName: (record.staff_id as any)?.username || 'Unknown',
        createdAt: record.createdAt
      }));

      const newUsersDetails = todayUsers.map(user => ({
        username: user.username,
        email: user.email,
        registeredAt: user.createdAt
      }));

      return {
        totals: {
          animals: totalAnimals,
          users: totalUsers,
          medicalRecords: totalMedicalRecords,
          observations: totalObservations,
          feedingRecords: totalFeedingRecords
        },
        todayActivities: {
          animalsOnboarded: {
            count: todayAnimals.length,
            details: animalsOnboardedDetails
          },
          medicalRecords: {
            count: todayMedicalRecords.length,
            details: medicalRecordsDetails
          },
          observations: {
            count: todayObservations.length,
            details: observationsDetails
          },
          feedingRecords: {
            count: todayFeedingRecords.length,
            details: feedingRecordsDetails
          },
          newUsers: {
            count: todayUsers.length,
            details: newUsersDetails
          }
        },
        generatedAt: new Date()
      };

    } catch (error) {
      throw new Error(`Failed to retrieve analytics overview: ${error}`);
    }
  }
}