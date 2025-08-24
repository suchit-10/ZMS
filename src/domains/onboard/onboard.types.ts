import z from "zod";
import { DietItemDTO } from "../animals/dto";

export const OnboardSchema = z.object({
  animal: z.object({
    name: z.string(),
    species: z.string(),
    sex: z.string(),
    age: z.number(),
    acquisitionDate: z.string(),
    acquisitionType: z.string(),
    identification: z
      .object({
        microchipId: z.string(),
        tatoo: z.string().optional(),
      }),
    weight: z.number(),
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
  ageCategory: z.enum(["adult", "senior"]).default("adult"),
  specialConditions: z.string().optional(),
  totalCaloriesPerDay: z.number(),
  feedingFrequencyPerDay: z.number(),
  dietItems: z.array(z.custom<DietItemDTO>()),
  }),
});

export type OnboardRequest = z.infer<typeof OnboardSchema>;
