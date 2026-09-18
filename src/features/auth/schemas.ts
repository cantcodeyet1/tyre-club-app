import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export const signInSchema = emailSchema.extend({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(2, 'Enter your full name'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Use at least 8 characters'),
  token: z.string().min(1, 'Reset token is required'),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
