import { z, ZodError } from 'zod';

export interface ValidationResult<T> {
  success: boolean;
  data: T | null;
  errors: string[];
}

export const validateData = <T>(rawData: any, schema: z.ZodType<T>): ValidationResult<T> => {
  try {
    const data = schema.parse(rawData);
    return {
      success: true,
      data,
      errors: []
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      data: null,
      errors: ['Unknown validation error']
    };
  }
};