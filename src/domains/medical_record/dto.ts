import z from "zod";
import mongoose from 'mongoose';

const MedicalRecordSchema = z.object({
  animal_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid animal ID format'
  }),

  examination_date: z.coerce.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return date <= today;
    },
    "Examination date cannot be in the future"
  ),
  
  examination_type: z.enum([
    "routine",
    "emergency", 
    "follow_up",
    "pre_breeding",
    "quarantine"
  ]),
  
  veterinarian_name: z.string().min(1, "Veterinarian name is required").max(100, "Veterinarian name too long"),
  
  weight_kg: z.number().min(0.01, "Weight must be positive").max(9999.99, "Weight too large").optional(),
  
  temperature_celsius: z.number().min(25.0, "Temperature too low").max(50.0, "Temperature too high").optional(),
  
  heart_rate_bpm: z.number().min(10, "Heart rate too low").max(1000, "Heart rate too high").optional(),
  
  respiratory_rate_per_min: z.number().min(1, "Respiratory rate too low").max(200, "Respiratory rate too high").optional(),
  
  symptoms: z.string().max(2000, "Symptoms description too long").optional(),
  
  diagnosis: z.string().max(2000, "Diagnosis too long").optional(),
  
  treatment: z.string().max(2000, "Treatment description too long").optional(),
  
  medications: z.string().max(1000, "Medications list too long").optional(),
  
  follow_up_required: z.boolean().default(false),
  
  follow_up_date: z.coerce.date().optional(),
  
  notes: z.string().max(3000, "Notes too long").optional(),
  
  extra_attributes: z.object().default({})
});

export const MedicalRecordParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid medical record ID format'
  })
});

export const AnimalMedicalRecordsQuerySchema = z.object({
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

export type MedicalRecordRequest = z.infer<typeof MedicalRecordSchema>;
export type MedicalRecordParams = z.infer<typeof MedicalRecordParamsSchema>;
export type AnimalMedicalRecordsQuery = z.infer<typeof AnimalMedicalRecordsQuerySchema>;

export { MedicalRecordSchema };