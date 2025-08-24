import z from "zod";
import { DietItemDTO } from "../animals/dto";

export const OnboardSchema = z.object({
  animal: z.object({
    name: z.string(),
    species: z.string(),
    sex: z.string(),
    age: z.number(),
    acquisitionDate: z.string(),
    acquisitionType: z.string().optional(),
    microchipId: z.string(),
    weight: z.number(),
  }),
  enclosure: z.object({
    enclosureName: z.string(),
    enclosureType: z.string(),
    temperatureMinCelsius: z.number().optional(),
    temperatureMaxCelsius: z.number().optional(),
    safetyLevel: z.string(),
  }),
  dietPlan: z.object({
  dietName: z.string(),
  ageCategory: z.enum(["adult", "senior"]).default("adult"),
  specialConditions: z.string().optional(),
  totalCaloriesPerDay: z.number().optional(),
  feedingFrequencyPerDay: z.number().optional(),
  dietItems: z.array(z.custom<DietItemDTO>()).optional().default([]),
  }),
});

export type OnboardRequest = z.infer<typeof OnboardSchema>;
