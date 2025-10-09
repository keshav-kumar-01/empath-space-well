import { z } from 'zod';

/**
 * Common validation schemas for forms
 * Using zod for type-safe validation
 */

// Email validation
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

// Password validation
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(128, { message: "Password must be less than 128 characters" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" });

// Name validation
export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name is required" })
  .max(100, { message: "Name must be less than 100 characters" })
  .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, hyphens, and apostrophes" });

// Phone validation (Indian format)
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, { message: "Invalid phone number. Must be 10 digits starting with 6-9" });

// Message/Text validation
export const messageSchema = z
  .string()
  .trim()
  .min(1, { message: "Message cannot be empty" })
  .max(2000, { message: "Message must be less than 2000 characters" });

// Feedback form schema
export const feedbackFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: messageSchema,
  rating: z.number().min(1).max(5).optional(),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().trim().min(1).max(200),
  message: messageSchema,
});

// Login form schema
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

// Signup form schema
export const signupFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: nameSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Sanitize HTML to prevent XSS
export const sanitizeHTML = (html: string): string => {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

// Sanitize URL parameters
export const sanitizeUrlParam = (param: string): string => {
  return encodeURIComponent(param.trim());
};

// Validate and sanitize user input before external API calls
export const validateAndSanitize = (input: string, maxLength: number = 500): string => {
  const sanitized = input.trim().slice(0, maxLength);
  return sanitizeHTML(sanitized);
};

export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
