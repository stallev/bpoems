'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  AuthFormTypes,
  AuthFormPlaceholders,
  AuthFormLabels,
  AuthFormTitles,
  AuthFormButtons,
  AuthFormLinks,
  AuthProviders,
} from '@/features/auth/constants/AuthConstants';
import { loginValidateAction } from '@/features/auth/server-actions/login';
import { registerAction } from '@/features/auth/server-actions/register';
import { AuthErrors } from '@/shared/constants/Errors';
import { RoutePath } from '@/shared/constants/RoutePath';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcnComponents/form';
import { Input } from '@/shared/ui/shadcnComponents/input';

// Login validation schema
const loginSchema = z.object({
  email: z.string().email(AuthErrors.INVALID_EMAIL),
  password: z.string().min(1, AuthErrors.PASSWORD_REQUIRED),
});

// Registration validation schema
const registerSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email(AuthErrors.INVALID_EMAIL),
    password: z.string().min(8, AuthErrors.PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS),
    confirmPassword: z.string().min(1, AuthErrors.CONFIRM_PASSWORD),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: AuthErrors.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

type FormMode = typeof AuthFormTypes.LOGIN | typeof AuthFormTypes.REGISTER;

export function AuthForm() {
  const [mode, setMode] = useState<FormMode>(AuthFormTypes.LOGIN);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const router = useRouter();

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Clear form state when switching modes
  useEffect(() => {
    setFormError('');
    setLoginLoading(false);
    setRegisterLoading(false);
    if (mode === AuthFormTypes.LOGIN) {
      loginForm.reset();
    } else {
      registerForm.reset();
    }
  }, [mode, loginForm, registerForm]);

  // Function to determine if email field should be highlighted
  const shouldHighlightEmail = (currentMode: FormMode) => {
    if (currentMode !== mode) return false;

    // Check server errors
    const hasServerError = [
      AuthErrors.EMAIL_ALREADY_REGISTERED,
      AuthErrors.EMAIL_AND_PASSWORD_REQUIRED,
      AuthErrors.INVALID_EMAIL_OR_PASSWORD,
      AuthErrors.INVALID_EMAIL,
    ].includes(formError);

    // Check validation errors
    const hasValidationError =
      currentMode === AuthFormTypes.LOGIN
        ? !!loginForm.formState.errors.email
        : !!registerForm.formState.errors.email;

    return hasServerError || hasValidationError;
  };

  // Function to determine if password field should be highlighted
  const shouldHighlightPassword = (currentMode: FormMode) => {
    if (currentMode !== mode) return false;

    // Check server errors
    const hasServerError = [
      AuthErrors.EMAIL_AND_PASSWORD_REQUIRED,
      AuthErrors.INVALID_EMAIL_OR_PASSWORD,
      AuthErrors.PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS,
      AuthErrors.PASSWORD_REQUIRED,
    ].includes(formError);

    // Check validation errors
    const hasValidationError =
      currentMode === AuthFormTypes.LOGIN
        ? !!loginForm.formState.errors.password
        : !!registerForm.formState.errors.password;

    return hasServerError || hasValidationError;
  };

  // Function to determine if confirmPassword field should be highlighted
  const shouldHighlightConfirmPassword = (currentMode: FormMode) => {
    if (currentMode !== mode) return false;

    // Check server errors
    const hasServerError = [
      AuthErrors.PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS,
      AuthErrors.PASSWORDS_DO_NOT_MATCH,
      AuthErrors.CONFIRM_PASSWORD,
    ].includes(formError);

    // Check validation errors
    const hasValidationError = !!registerForm.formState.errors.confirmPassword;

    return hasServerError || hasValidationError;
  };

  // Handle input change to clear errors
  const handleInputChange = () => {
    if (formError) {
      setFormError('');
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setLoginLoading(true);
    setFormError('');

    try {
      const validationResult = await loginValidateAction(data);

      if (!validationResult.success) {
        setFormError(validationResult.error);
        setLoginLoading(false);
        return;
      }

      const signInResult = await signIn(AuthProviders.CREDENTIALS, {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        setFormError(AuthErrors.INVALID_EMAIL_OR_PASSWORD);
      } else {
        router.push(RoutePath.PROFILE.path);
      }
    } catch (error) {
      console.error('Unexpected error in onLoginSubmit:', error);
      setFormError(AuthErrors.INTERNAL_SERVER_ERROR);
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setRegisterLoading(true);
    setFormError('');

    try {
      const result = await registerAction({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (!result.success) {
        setFormError(result.error);
        setRegisterLoading(false);
        return;
      }

      // Auto-login after successful registration
      const signInResult = await signIn(AuthProviders.CREDENTIALS, {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        setFormError(AuthErrors.SESSION_CREATION_ERROR);
      } else {
        router.push(RoutePath.PROFILE.path);
      }
    } catch (error) {
      console.error('Unexpected error in onRegisterSubmit:', error);
      setFormError(AuthErrors.INTERNAL_SERVER_ERROR);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn(AuthProviders.GOOGLE, { callbackUrl: RoutePath.PROFILE.path });
  };

  const handleModeChange = (newMode: FormMode) => {
    setMode(newMode);
  };

  return (
    <div className="py-24 flex items-center justify-center bg-muted">
      <div className="bg-background p-8 rounded-lg shadow-md w-full max-w-96 border border-border">
        <h1 className="text-2xl font-bold mb-6 text-center text-foreground">
          {mode === AuthFormTypes.LOGIN ? AuthFormTitles.LOGIN : AuthFormTitles.REGISTER}
        </h1>

        {formError && (
          <div className="py-3">
            <span className="text-destructive text-md">{formError}</span>
          </div>
        )}

        {mode === AuthFormTypes.LOGIN ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{AuthFormLabels.LOGIN.EMAIL}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={AuthFormPlaceholders.LOGIN.EMAIL}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          handleInputChange();
                        }}
                        className={
                          shouldHighlightEmail(AuthFormTypes.LOGIN) ? 'border-destructive' : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{AuthFormLabels.LOGIN.PASSWORD}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={AuthFormPlaceholders.LOGIN.PASSWORD}
                        {...field}
                        onChange={e => {
                          field.onChange(e);
                          handleInputChange();
                        }}
                        className={
                          shouldHighlightPassword(AuthFormTypes.LOGIN) ? 'border-destructive' : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loginLoading ? AuthFormButtons.LOGIN.LOADING : AuthFormButtons.LOGIN.SUBMIT}
              </Button>
            </form>
          </Form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                {AuthFormLabels.REGISTER.NAME}
              </label>
              <input
                id="name"
                type="text"
                placeholder={AuthFormPlaceholders.REGISTER.NAME}
                {...registerForm.register('name')}
                onChange={e => {
                  registerForm.setValue('name', e.target.value);
                  handleInputChange();
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              {registerForm.formState.errors.name && (
                <span className="text-sm text-destructive block">
                  {registerForm.formState.errors.name.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                {AuthFormLabels.REGISTER.EMAIL}
              </label>
              <input
                id="email"
                type="email"
                placeholder={AuthFormPlaceholders.REGISTER.EMAIL}
                {...registerForm.register('email')}
                onChange={e => {
                  registerForm.setValue('email', e.target.value);
                  handleInputChange();
                }}
                className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  shouldHighlightEmail(AuthFormTypes.REGISTER)
                    ? 'border-destructive'
                    : 'border-input'
                }`}
              />
              {registerForm.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                {AuthFormLabels.REGISTER.PASSWORD}
              </label>
              <input
                id="password"
                type="password"
                placeholder={AuthFormPlaceholders.REGISTER.PASSWORD}
                {...registerForm.register('password')}
                onChange={e => {
                  registerForm.setValue('password', e.target.value);
                  handleInputChange();
                }}
                className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  shouldHighlightPassword(AuthFormTypes.REGISTER)
                    ? 'border-destructive'
                    : 'border-input'
                }`}
              />
              {registerForm.formState.errors.password && (
                <span className="text-sm text-destructive block">
                  {registerForm.formState.errors.password.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                {AuthFormLabels.REGISTER.CONFIRM_PASSWORD}
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder={AuthFormPlaceholders.REGISTER.CONFIRM_PASSWORD}
                {...registerForm.register('confirmPassword')}
                onChange={e => {
                  registerForm.setValue('confirmPassword', e.target.value);
                  handleInputChange();
                }}
                className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                  shouldHighlightConfirmPassword(AuthFormTypes.REGISTER)
                    ? 'border-destructive'
                    : 'border-input'
                }`}
              />
              {registerForm.formState.errors.confirmPassword && (
                <span className="text-sm text-destructive block">
                  {registerForm.formState.errors.confirmPassword.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {registerLoading ? AuthFormButtons.REGISTER.LOADING : AuthFormButtons.REGISTER.SUBMIT}
            </Button>
          </form>
        )}

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full mt-4 border-secondary text-secondary hover:bg-secondary/10"
        >
          {AuthFormButtons.GOOGLE}
        </Button>

        <p className="text-center text-foreground mt-4">
          {mode === AuthFormTypes.LOGIN
            ? AuthFormLinks.LOGIN.QUESTION
            : AuthFormLinks.REGISTER.QUESTION}{' '}
          <button
            type="button"
            onClick={() =>
              handleModeChange(
                mode === AuthFormTypes.LOGIN ? AuthFormTypes.REGISTER : AuthFormTypes.LOGIN
              )
            }
            className="text-primary hover:underline"
          >
            {mode === AuthFormTypes.LOGIN
              ? AuthFormLinks.LOGIN.ACTION
              : AuthFormLinks.REGISTER.ACTION}
          </button>
        </p>
      </div>
    </div>
  );
}
