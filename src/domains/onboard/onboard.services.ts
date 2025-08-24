import { OnboardRequest } from "./onboard.types";
import { Animal, IAnimal } from "../animals/model";
import mongoose from "mongoose";

export const onboardService = async (payload: OnboardRequest): Promise<IAnimal> => {
  try {
    // Transform the payload to match the Animal model structure
    const animalData = {
      // Animal basic information
      name: payload.animal.name,
      species: payload.animal.species,
      sex: payload.animal.sex,
      age: payload.animal.age,
      acquisitionDate: payload.animal.acquisitionDate,
      acquisitionType: payload.animal.acquisitionType,
      weight: payload.animal.weight,
      
      // Extract microchipId from nested identification object
      microchipId: payload.animal.microchipId,
      
      // Embedded enclosure document
      enclosure: {
        enclosureName: payload.enclosure.enclosureName,
        enclosureType: payload.enclosure.enclosureType,
        temperatureMinCelsius: payload.enclosure.temperatureMinCelsius,
        temperatureMaxCelsius: payload.enclosure.temperatureMaxCelsius,
        safetyLevel: payload.enclosure.safetyLevel,
      },
      
      // Embedded diet plan document
      dietPlan: {
        dietName: payload.dietPlan.dietName,
        ageCategory: payload.dietPlan.ageCategory,
        specialConditions: payload.dietPlan.specialConditions,
        totalCaloriesPerDay: payload.dietPlan.totalCaloriesPerDay,
        feedingFrequencyPerDay: payload.dietPlan.feedingFrequencyPerDay,
        dietItems: payload.dietPlan.dietItems,
      }
    };

    // Create new Animal document
    const animal = new Animal(animalData);
    
    // Save to database
    const savedAnimal = await animal.save();
    
    return savedAnimal;
    
  } catch (error) {
    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(`Validation failed: ${error.message}`);
    }
    
    // Handle duplicate microchip ID error
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      throw new Error('An animal with this microchip ID already exists');
    }
    
    // Handle other database errors
    if (error instanceof mongoose.Error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    // Handle any other errors
    throw new Error(`Failed to onboard animal: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
