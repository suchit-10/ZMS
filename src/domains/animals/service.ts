import mongoose from 'mongoose';
import { Animal, IAnimal } from './model';
import { AnimalRequest } from './dto';

export class AnimalService {
  
  static async createAnimal(data: AnimalRequest): Promise<IAnimal> {
    try {
      const animal = new Animal(data);
      const savedAnimal = await animal.save();
      
      return savedAnimal;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new Error(`Invalid data format: ${error.message}`);
      }
      // Handle duplicate microchip ID error
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        throw new Error('An animal with this microchip ID already exists');
      }
      throw new Error(`Failed to create animal: ${error}`);
    }
  }

  static async getAnimalById(animalId: string): Promise<IAnimal | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(animalId);
      const animal = await Animal.findById(objectId);
      
      return animal;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Invalid animal ID format');
      }
      throw new Error(`Failed to retrieve animal: ${error}`);
    }
  }

  static async getAllAnimals(page = 1, limit = 10, species?: string, search?: string): Promise<{
    animals: IAnimal[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const skip = (page - 1) * limit;
      
      // Build query filter
      const filter: any = {};
      
      if (species) {
        filter.species = { $regex: species, $options: 'i' };
      }
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { species: { $regex: search, $options: 'i' } },
          { microchipId: { $regex: search, $options: 'i' } }
        ];
      }

      const [animals, total] = await Promise.all([
        Animal.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Animal.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        animals,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      throw new Error(`Failed to retrieve animals: ${error}`);
    }
  }

  static async updateAnimal(animalId: string, data: Partial<AnimalRequest>): Promise<IAnimal | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(animalId);
      const updatedAnimal = await Animal.findByIdAndUpdate(
        objectId,
        data,
        { new: true, runValidators: true }
      );
      
      return updatedAnimal;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(`Validation failed: ${error.message}`);
      }
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Invalid animal ID format');
      }
      // Handle duplicate microchip ID error
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        throw new Error('An animal with this microchip ID already exists');
      }
      throw new Error(`Failed to update animal: ${error}`);
    }
  }

  static async deleteAnimal(animalId: string): Promise<boolean> {
    try {
      const objectId = new mongoose.Types.ObjectId(animalId);
      const deletedAnimal = await Animal.findByIdAndDelete(objectId);
      
      return !!deletedAnimal;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new Error('Invalid animal ID format');
      }
      throw new Error(`Failed to delete animal: ${error}`);
    }
  }
}