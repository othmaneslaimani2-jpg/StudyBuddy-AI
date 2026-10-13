import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agree: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const addTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().max(200, 'Description must not exceed 200 characters').optional(),
  subjectName: z.string().min(1, 'Subject is required'),
  dueDate: z.date(),
  priority: z.enum(['Low', 'Medium', 'High']),
  reminder: z.string(),
});

export type AddTaskFormData = z.infer<typeof addTaskSchema>;

export const uploadNoteSchema = z.object({
  title: z.string().min(1, 'Note title is required'),
  subjectName: z.string().min(1, 'Subject is required'),
});

export type UploadNoteFormData = z.infer<typeof uploadNoteSchema>;

export const editProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

