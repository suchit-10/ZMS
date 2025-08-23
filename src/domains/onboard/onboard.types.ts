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
  })
})

export interface OnboardRequest {
  animal: {
    name: string;
    species: string;
    sex: string;
    age: number;
    acquisition_date: string;
    acquisition_type: string;
    identification?: {
      microchip_id?: string;
      tattoo?: string;
    };
    weight?: number;
  };
  enclosure: {
    enclosure_name: string;
    enclosure_type: string;
    temperature_min_celsius:number
    temperature_max_celsius:number
    safety_level:string
  };
  diet_plan: {
    diet_name: string;
    diet_items: DietItemDTO[]
    age_category: string;
    special_conditions?: string;
    total_calories: number;
  };
}

// export type OnboardRequest = z.infer<typeof OnboardSchema>;