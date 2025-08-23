import z from "zod";
import { DietItemDTO } from "../diet/dto";

export const OnboardSchema = z.object({
  animal: z.object({
    name: z.string(),
    species: z.string(),
    sex: z.string(),
    age: z.number(),
    acquisitionDate: z.date(),
    acquisitionType: z.string(),
    identification: z
      .object({
        microchipId: z.string().optional(),
        tatoo: z.string().optional(),
      })
      .optional(),
    weight: z.number().optional(),
  }),
  enclosure: z.object({
    enclosureName: z.string(),
    enclosureType: z.string(),
    temperatureMinCelsius: z.number(),
    temperatureMaxCelsius: z.number(),
    safetyLevel: z.string(),
  }),
  dietPlan: z.object({
    dietName: z.string(),
    dietItems: z.array(z.custom<DietItemDTO>()),
    ageCategory: z.string(),
    specialConditions: z.string().optional(),
    totalCalories: z.number(),
  }),
});

export type OnboardRequest = z.infer<typeof OnboardSchema>;
