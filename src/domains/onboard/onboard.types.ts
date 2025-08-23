import z from "zod";
import { DietItemDTO } from "../diet/dto";


export const OnboardSchema = z.object({
  animal: z.object({
    name: z.string(),
    species:z.string(),
    sex:z.string(),
    age:z.number(),
    acquisition_date: z.date(),
    acquisition_type: z.string(),
    identification: z.object({
      microchip_id : z.string().optional(),
      tatoo: z.string().optional()
    }).optional(),
    weight: z.number().optional()
  }),
  enclosure: z.object({
    enclosure_name: z.string(),
    enclosure_type: z.string(),
    temperature_min_celsius: z.number(),
    temperature_max_celsius: z.number(),
    safety_level: z.string(),
  }),
  diet_plan: z.object({
    diet_name: z.string(),
    diet_items: z.array(z.custom<DietItemDTO>()),
    age_category: z.string(),
    special_conditions: z.string().optional(),
    total_calories: z.number(),
  }),
});

export type OnboardRequest = z.infer<typeof OnboardSchema>;