import { z } from 'zod';

// 1. We create a reusable password rule set so we can use it for 
// resetting passwords later without rewriting code!
const passwordValidation = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// 2. The Registration Schema
export const registerSchema = z.object({
  body: z.object({
    name: z.string({ error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z.string({ error: 'Email is required' })
      .email('Please provide a valid email address'),
    password: passwordValidation,
  }).strict(), // 👈 Reject any extra fields from malicious users
});

// 3. The Login Schema (Might as well build this now!)
export const loginSchema = z.object({
  body: z.object({
    email: z.string({ error: 'Email is required' })
      .email('Please provide a valid email address'),
    // Notice we don't use the complex regex here. 
    // If they are logging in, we just need to know they sent a string!
    password: z.string({ error: 'Password is required' }), 
  }).strict(),
});

// 4. Extract the strictly-typed inputs for your Controllers and Services
export type RegisterUserInput = z.infer<typeof registerSchema>['body'];
export type LoginUserInput = z.infer<typeof loginSchema>['body'];