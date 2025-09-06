import z from "zod";
import mongoose from 'mongoose';

const ObservationSchema = z.object({
  animal_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid animal ID format'
  }),

  observation_at: z.coerce.date().refine(
    (date) => date <= new Date(),
    "Observation date cannot be in the future"
  ),

  observer_staff_id: z.string().transform((val) => val === '' ? undefined : val).refine((val) => val === undefined || mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid observer staff ID format'
  }).optional(),
  
  behavior_category: z.enum([
    "feeding",
    "social", 
    "reproductive",
    "aggressive",
    "play",
    "rest",
    "exploration",
    "abnormal"
  ]),
  
  behavior_description: z.string().min(5, "Behavior description must be at least 5 characters"),
  
  duration_minutes: z.number().min(0, "Duration must be non-negative").optional(),
  
  environmental_factors: z.string().optional(),
  
  severity: z.enum(["normal", "concerning", "critical"]).default("normal"),
  
  follow_up_required: z.boolean().default(false)
});

export const ObservationParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid observation ID format'
  })
});

export const AnimalObservationsQuerySchema = z.object({
  animal_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid animal ID format'
  }),
  page: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0, {
    message: 'Page must be a positive number'
  }).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0 && val <= 100, {
    message: 'Limit must be between 1 and 100'
  }).optional()
});

export type ObservationRequest = z.infer<typeof ObservationSchema>;
export type ObservationParams = z.infer<typeof ObservationParamsSchema>;
export type AnimalObservationsQuery = z.infer<typeof AnimalObservationsQuerySchema>;

export { ObservationSchema };