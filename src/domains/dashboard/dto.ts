import z from "zod";
import mongoose from 'mongoose';

const DashboardQuerySchema = z.object({
  limit: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0 && val <= 100, {
    message: 'Limit must be between 1 and 100'
  }).optional(),
  
  start_date: z.string().transform((val) => new Date(val)).refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid start date format'
  }).optional(),
  
  end_date: z.string().transform((val) => new Date(val)).refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid end date format'
  }).optional(),
  
  include_health_metrics: z.string().transform(val => val.toLowerCase() === 'true').optional(),
  
  include_behavioral_data: z.string().transform(val => val.toLowerCase() === 'true').optional(),
  
  animal_ids: z.string().transform(val => 
    val.split(',').map(id => id.trim()).filter(id => mongoose.Types.ObjectId.isValid(id))
  ).refine(ids => ids.length > 0, {
    message: 'At least one valid animal ID is required'
  }).optional()
});

const DashboardCreateSchema = z.object({
  dashboard_type: z.enum([
    "daily_summary",
    "weekly_report", 
    "monthly_overview",
    "health_status",
    "behavioral_analysis",
    "custom"
  ]),
  
  date_range: z.object({
    start_date: z.coerce.date(),
    end_date: z.coerce.date()
  }).refine(
    (data) => data.start_date < data.end_date,
    {
      message: 'Start date must be before end date'
    }
  ),
  
  include_health_metrics: z.boolean().default(true),
  
  include_behavioral_data: z.boolean().default(true),
  
  include_population_stats: z.boolean().default(true),
  
  animal_ids: z.array(z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid animal ID format'
  })).optional(),
  
  enclosure_ids: z.array(z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid enclosure ID format'
  })).optional(),
  
  species_filter: z.array(z.string().min(1, "Species name cannot be empty")).optional(),
  
  age_range: z.object({
    min_age: z.number().min(0, "Minimum age must be non-negative"),
    max_age: z.number().min(0, "Maximum age must be non-negative")
  }).refine(data => data.min_age <= data.max_age, {
    message: 'Minimum age must be less than or equal to maximum age'
  }).optional(),
  
  health_status_filter: z.array(z.enum([
    "healthy", 
    "sick", 
    "injured", 
    "recovering", 
    "critical",
    "unknown"
  ])).optional(),
  
  custom_filters: z.record(z.string(), z.any()).default({}),
  
  notes: z.string().max(1000, "Notes too long").optional(),
  
  extra_attributes: z.object().default({})
});

export const DashboardParamsSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid dashboard ID format'
  })
});


const DashboardUpdateSchema = z.object({
  dashboard_type: z.enum([
    "daily_summary",
    "weekly_report", 
    "monthly_overview",
    "health_status",
    "behavioral_analysis",
    "custom"
  ]).optional(),
  
  include_health_metrics: z.boolean().optional(),
  
  include_behavioral_data: z.boolean(),
  
  include_population_stats: z.boolean(),
  
  is_archived: z.boolean().optional(),

});

export const DashboardListQuerySchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0, {
    message: 'Page must be a positive number'
  }).optional(),
  
  limit: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0 && val <= 100, {
    message: 'Limit must be between 1 and 100'
  }).optional(),
  
  dashboard_type: z.enum([
    "daily_summary",
    "weekly_report", 
    "monthly_overview",
    "health_status",
    "behavioral_analysis",
    "custom"
  ]).optional(),
  
  created_after: z.string().transform((val) => new Date(val)).refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid created_after date format'
  }).optional(),
  
  created_before: z.string().transform((val) => new Date(val)).refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid created_before date format'
  }).optional()
});

export type DashboardQuery = z.infer<typeof DashboardQuerySchema>;
export type DashboardCreateRequest = z.infer<typeof DashboardCreateSchema>;
export type DashboardParams = z.infer<typeof DashboardParamsSchema>;
export type DashboardUpdateRequest = z.infer<typeof DashboardUpdateSchema>;
export type DashboardListQuery = z.infer<typeof DashboardListQuerySchema>;

export { 
  DashboardQuerySchema,
  DashboardCreateSchema,
  DashboardUpdateSchema
};