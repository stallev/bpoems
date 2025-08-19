'use client';

import { FormProvider } from 'react-hook-form';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import {
  AuthFormTitles,
  AuthFormButtons,
  AuthFormLinks,
  AuthFormTypes,
} from '../constants/AuthConstants';
import { useAuthForm } from '../lib/useAuthForm';
import { useFieldHighlight } from '../lib/useFieldHighlight';
import { FORM_MODES, type FormMode } from '../model/types';

export function AuthFormContainer() {
  const {
    state,
    loginForm,
    registerForm,
    setMode,
    clearFormError,
    onLoginSubmit,
    onRegisterSubmit,
    handleGoogleSignIn,
  } = useAuthForm();

  const { shouldHighlightEmail, shouldHighlightPassword, shouldHighlightConfirmPassword } =
    useFieldHighlight({
      mode: state.mode,
      formError: state.formError,
      hasValidationError: false, // Will be calculated per field
    });

  const handleInputChange = () => {
    if (state.formError) {
      clearFormError();
    }
  };

  const handleModeChange = (newMode: FormMode) => {
    setMode(newMode);
  };

  return (
    <div className="py-24 flex items-center justify-center bg-muted">
      <div className="bg-background p-8 rounded-lg shadow-md w-full max-w-96 border border-border">
        <h1 className="text-2xl font-bold mb-6 text-center text-foreground">
          {state.mode === AuthFormTypes.LOGIN ? AuthFormTitles.LOGIN : AuthFormTitles.REGISTER}
        </h1>

        {state.formError && (
          <div className="py-3">
            <span className="text-destructive text-md">{state.formError}</span>
          </div>
        )}

        {state.mode === AuthFormTypes.LOGIN ? (
          <FormProvider {...loginForm}>
            <LoginForm
              onSubmit={onLoginSubmit}
              loading={state.loginLoading}
              onInputChange={handleInputChange}
              shouldHighlightEmail={shouldHighlightEmail(AuthFormTypes.LOGIN)}
              shouldHighlightPassword={shouldHighlightPassword(AuthFormTypes.LOGIN)}
            />
          </FormProvider>
        ) : (
          <FormProvider {...registerForm}>
            <RegisterForm
              onSubmit={onRegisterSubmit}
              loading={state.registerLoading}
              onInputChange={handleInputChange}
              shouldHighlightEmail={shouldHighlightEmail(FORM_MODES.REGISTER)}
              shouldHighlightPassword={shouldHighlightPassword(FORM_MODES.REGISTER)}
              shouldHighlightConfirmPassword={shouldHighlightConfirmPassword(FORM_MODES.REGISTER)}
            />
          </FormProvider>
        )}

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full mt-4 border-secondary text-secondary hover:bg-secondary/10"
        >
          {AuthFormButtons.GOOGLE}
        </Button>

        <p className="text-center text-foreground mt-4">
          {state.mode === AuthFormTypes.LOGIN
            ? AuthFormLinks.LOGIN.QUESTION
            : AuthFormLinks.REGISTER.QUESTION}{' '}
          <button
            type="button"
            onClick={() =>
              handleModeChange(
                state.mode === AuthFormTypes.LOGIN ? FORM_MODES.REGISTER : FORM_MODES.LOGIN
              )
            }
            className="text-primary hover:underline"
          >
            {state.mode === AuthFormTypes.LOGIN
              ? AuthFormLinks.LOGIN.ACTION
              : AuthFormLinks.REGISTER.ACTION}
          </button>
        </p>
      </div>
    </div>
  );
}
