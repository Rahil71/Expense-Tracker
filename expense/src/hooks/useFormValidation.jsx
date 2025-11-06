import { z } from "zod"

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  budgetLimit: z
    .string()
    .optional()
    .refine((val) => !val || Number(val) > 0, "Budget must be a positive number"),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), "Invalid phone number format"),
})

export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => Number(val) > 0, "Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  date: z.string().refine((val) => new Date(val) <= new Date(), "Date cannot be in the future"),
  notes: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.enum(["weekly", "monthly", "yearly"]).optional(),
})

export function formatValidationError(field, error) {
  return error?.message || `${field} is invalid`
}
