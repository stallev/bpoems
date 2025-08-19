import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

// Registration validation schema
export const registerSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email('Неверный формат email'),
    password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Определяем литеральные типы для форм
export const FORM_MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
} as const;

export type FormMode = (typeof FORM_MODES)[keyof typeof FORM_MODES];

export interface AuthFormState {
  mode: FormMode;
  loginLoading: boolean;
  registerLoading: boolean;
  formError: string;
}
