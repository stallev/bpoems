import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AuthErrors } from '@/shared/constants/Errors';
import { RoutePath } from '@/shared/constants/RoutePath';
import { AuthProviders } from '../constants/AuthConstants';
import {
  loginSchema,
  registerSchema,
  FORM_MODES,
  type LoginFormData,
  type RegisterFormData,
  type FormMode,
  type AuthFormState,
} from '../model/types';
import { loginValidateAction } from '../server-actions/login';
import { registerAction } from '../server-actions/register';

export function useAuthForm() {
  const [state, setState] = useState<AuthFormState>({
    mode: FORM_MODES.LOGIN,
    loginLoading: false,
    registerLoading: false,
    formError: '',
  });

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
    setState(prev => ({
      ...prev,
      formError: '',
      loginLoading: false,
      registerLoading: false,
    }));

    if (state.mode === FORM_MODES.LOGIN) {
      loginForm.reset();
    } else {
      registerForm.reset();
    }
  }, [state.mode, loginForm, registerForm]);

  const setMode = (mode: FormMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  const setFormError = (error: string) => {
    setState(prev => ({ ...prev, formError: error }));
  };

  const clearFormError = () => {
    setState(prev => ({ ...prev, formError: '' }));
  };

  const setLoginLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loginLoading: loading }));
  };

  const setRegisterLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, registerLoading: loading }));
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setLoginLoading(true);
    clearFormError();

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
    clearFormError();

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

  return {
    state,
    loginForm,
    registerForm,
    setMode,
    setFormError,
    clearFormError,
    onLoginSubmit,
    onRegisterSubmit,
    handleGoogleSignIn,
  };
}
