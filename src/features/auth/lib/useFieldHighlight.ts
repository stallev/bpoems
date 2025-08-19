import { AuthErrors } from '@/shared/constants/Errors';
import { type FormMode } from '../model/types';

interface UseFieldHighlightProps {
  mode: FormMode;
  formError: string;
  hasValidationError: boolean;
}

export function useFieldHighlight({ mode, formError, hasValidationError }: UseFieldHighlightProps) {
  const shouldHighlightEmail = (currentMode: FormMode) => {
    if (currentMode !== mode) return false;

    // Check server errors
    const hasServerError = [
      AuthErrors.EMAIL_ALREADY_REGISTERED,
      AuthErrors.EMAIL_AND_PASSWORD_REQUIRED,
      AuthErrors.INVALID_EMAIL_OR_PASSWORD,
      AuthErrors.INVALID_EMAIL,
    ].includes(formError);

    return hasServerError || hasValidationError;
  };

  const shouldHighlightPassword = (currentMode: FormMode) => {
    if (currentMode !== mode) return false;

    // Check server errors
    const hasServerError = [
      AuthErrors.EMAIL_AND_PASSWORD_REQUIRED,
      AuthErrors.INVALID_EMAIL_OR_PASSWORD,
      AuthErrors.PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS,
      AuthErrors.PASSWORD_REQUIRED,
    ].includes(formError);

    return hasServerError || hasValidationError;
  };

  const shouldHighlightConfirmPassword = (currentMode: FormMode) => {
    if (currentMode !== mode) return false;

    // Check server errors
    const hasServerError = [
      AuthErrors.PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS,
      AuthErrors.PASSWORDS_DO_NOT_MATCH,
      AuthErrors.CONFIRM_PASSWORD,
    ].includes(formError);

    return hasServerError || hasValidationError;
  };

  return {
    shouldHighlightEmail,
    shouldHighlightPassword,
    shouldHighlightConfirmPassword,
  };
}
