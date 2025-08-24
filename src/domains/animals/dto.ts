import z from "zod";
import mongoose from 'mongoose';

export interface DietItemDTO {
    foodItem:string
    quantityInGrams:number
    feedingTime:string
    preparationInstructions?:string
    nutritionNotes?:string
}

const DietItemSchema = z.object({
  foodItem: z.string().min(1, "Food item is required"),
  quantityInGrams: z.number().min(0.01, "Quantity must be positive"),
  feedingTime: z.string().min(1, "Feeding time is required"),
  preparationInstructions: z.string().optional(),
  nutritionNotes: z.string().optional()
});

const DietPlanSchema = z.object({
  dietName: z.string().min(1, "Diet name is required"),
  ageCategory: z.enum(["adult", "senior"]).default("adult"),
  specialConditions: z.string().optional(),
  totalCaloriesPerDay: z.number().min(0, "Calories must be non-negative").optional(),
  feedingFrequencyPerDay: z.number().min(1, "Feeding frequency must be at least 1").optional(),
  dietItems: z.array(DietItemSchema)
});

const EnclosureSchema = z.object({
  enclosureName: z.string().min(1, "Enclosure name is required"),
  enclosureType: z.enum(["indoor", "outdoor", "mixed"]),
  areaSquareMeters: z.number().min(0, "Area cannot be negative").optional(),
  capacityMax: z.number().min(1, "Capacity must be at least 1").optional(),
  climateControlled: z.boolean().default(false),
  temperatureMinCelsius: z.number().optional(),
  temperatureMaxCelsius: z.number().optional(),
  humidityMinPercent: z.number().min(0).max(100, "Humidity must be between 0-100").optional(),
  humidityMaxPercent: z.number().min(0).max(100, "Humidity must be between 0-100").optional(),
  safetyLevel: z.enum(["restrictedAccess", "quarantine", "hospital"]).optional(),
  locationCoordinates: z.string().optional(),
  constructionDate: z.coerce.date().optional(),
  lastMaintenanceDate: z.coerce.date().optional(),
  status: z.enum(["active", "maintenance", "closed"]).default("active")
});

const AnimalSchema = z.object({
  name: z.string().min(1, "Animal name is required"),
  species: z.string().min(1, "Species is required"),
  sex: z.string().min(1, "Sex is required"),
  age: z.number().min(0, "Age cannot be negative"),
  acquisitionDate: z.coerce.date(),
  acquisitionType: z.string().min(1, "Acquisition type is required"),
  dateOfDeath: z.coerce.date().optional(),
  causeOfDeath: z.string().optional(),
  distinguishingMarks: z.string().optional(),
  images: z.string().optional(),
  microchipId: z.string().min(1, "Microchip ID is required"),
  weight: z.number().min(0.01, "Weight must be positive"),
  extraAttributes: z.record(z.string(), z.any()).default({}),
  enclosure: EnclosureSchema,
  dietPlan: DietPlanSchema
});

export const AnimalParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid animal ID format'
  })
});

export const AnimalsQuerySchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0, {
    message: 'Page must be a positive number'
  }).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0 && val <= 100, {
    message: 'Limit must be between 1 and 100'
  }).optional(),
  species: z.string().optional(),
  search: z.string().optional()
});

export type AnimalRequest = z.infer<typeof AnimalSchema>;
export type AnimalParams = z.infer<typeof AnimalParamsSchema>;
export type AnimalsQuery = z.infer<typeof AnimalsQuerySchema>;

export { AnimalSchema };