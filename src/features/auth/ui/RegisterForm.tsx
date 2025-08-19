import { useFormContext } from 'react-hook-form';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { AuthFormLabels, AuthFormPlaceholders, AuthFormButtons } from '../constants/AuthConstants';
import { type RegisterFormData } from '../model/types';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  loading: boolean;
  onInputChange: () => void;
  shouldHighlightEmail: boolean;
  shouldHighlightPassword: boolean;
  shouldHighlightConfirmPassword: boolean;
}

export function RegisterForm({
  onSubmit,
  loading,
  onInputChange,
  shouldHighlightEmail,
  shouldHighlightPassword,
  shouldHighlightConfirmPassword,
}: RegisterFormProps) {
  const form = useFormContext<RegisterFormData>();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          {AuthFormLabels.REGISTER.NAME}
        </label>
        <input
          id="name"
          type="text"
          placeholder={AuthFormPlaceholders.REGISTER.NAME}
          {...form.register('name')}
          onChange={e => {
            form.setValue('name', e.target.value);
            onInputChange();
          }}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {form.formState.errors.name && (
          <span className="text-sm text-destructive block">
            {form.formState.errors.name.message}
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
          {...form.register('email')}
          onChange={e => {
            form.setValue('email', e.target.value);
            onInputChange();
          }}
          className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            shouldHighlightEmail ? 'border-destructive' : 'border-input'
          }`}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
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
          {...form.register('password')}
          onChange={e => {
            form.setValue('password', e.target.value);
            onInputChange();
          }}
          className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            shouldHighlightPassword ? 'border-destructive' : 'border-input'
          }`}
        />
        {form.formState.errors.password && (
          <span className="text-sm text-destructive block">
            {form.formState.errors.password.message}
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
          {...form.register('confirmPassword')}
          onChange={e => {
            form.setValue('confirmPassword', e.target.value);
            onInputChange();
          }}
          className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            shouldHighlightConfirmPassword ? 'border-destructive' : 'border-input'
          }`}
        />
        {form.formState.errors.confirmPassword && (
          <span className="text-sm text-destructive block">
            {form.formState.errors.confirmPassword.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? AuthFormButtons.REGISTER.LOADING : AuthFormButtons.REGISTER.SUBMIT}
      </Button>
    </form>
  );
}
