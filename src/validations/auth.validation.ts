import { z } from 'zod';

/*
    Validation schemas for user authentication-related operations.
    This includes schemas for user registration and login.
    Each schema defines the expected structure and constraints for incoming request data,
    ensuring that only valid data is processed by the application.
*/

// Password Validation Schema
const passwordValidation = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Registration Schema
export const registerSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z.string({ error: 'Email is required' })
      .email('Please provide a valid email address'),
    password: passwordValidation,
  }).strict(), 
});

// Login Schema 
export const loginSchema = z.object({
  body: z.object({
    email: z.string({ error: 'Email is required' })
      .email('Please provide a valid email address'),
    password: z.string({ error: 'Password is required' }), 
  }).strict(),
});

// Extract the strictly-typed inputs for your Controllers and Services
export type RegisterUserInput = z.infer<typeof registerSchema>['body'];
export type LoginUserInput = z.infer<typeof loginSchema>['body'];