import z from "zod";
import mongoose from 'mongoose';

export const UserParamsSchema = z.object({
  userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid user ID format'
  })
});

export const CreateUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be at most 30 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long')
});

export const UpdateUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be at most 30 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  isActive: z.boolean().optional()
});

export const UserQuerySchema = z.object({
  page: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0, {
    message: 'Page must be a positive number'
  }).optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).refine((val) => val > 0 && val <= 100, {
    message: 'Limit must be between 1 and 100'
  }).optional(),
  search: z.string().optional()
});

export const SignInSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export interface UserResponse {
      id?: mongoose.Types.ObjectId;
      username?: string;
      email?: string;
}

export type SignInRequest = z.infer<typeof SignInSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;
export type UserQuery = z.infer<typeof UserQuerySchema>;