import z from "zod";
import mongoose from 'mongoose';

const FeedingRecordSchema = z.object({
  animal_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid animal ID format'
  }),

  feeding_at: z.coerce.date().refine(
    (date) => date <= new Date(),
    "Feeding date cannot be in the future"
  ),
  
  diet_item_id: z.string().optional(),
  
  quantity_given_grams: z.number().min(0.01, "Quantity given must be positive").max(99999.99, "Quantity given too large").optional(),
  
  quantity_consumed_grams: z.number().min(0, "Quantity consumed cannot be negative").max(99999.99, "Quantity consumed too large").optional(),
  
  staff_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid staff ID format'
  }).optional(),
  
  appetite_rating: z.enum([
    "excellent",
    "good", 
    "fair",
    "poor",
    "refused"
  ]).default("good"),
  
  behavioral_notes: z.string().max(2000, "Behavioral notes too long").optional()
});

export const FeedingRecordParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid feeding record ID format'
  })
});

export const AnimalFeedingRecordsQuerySchema = z.object({
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

export type FeedingRecordRequest = z.infer<typeof FeedingRecordSchema>;
export type FeedingRecordParams = z.infer<typeof FeedingRecordParamsSchema>;
export type AnimalFeedingRecordsQuery = z.infer<typeof AnimalFeedingRecordsQuerySchema>;

export { FeedingRecordSchema };