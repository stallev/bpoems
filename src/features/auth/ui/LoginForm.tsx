import { useFormContext } from 'react-hook-form';
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
import { AuthFormLabels, AuthFormPlaceholders, AuthFormButtons } from '../constants/AuthConstants';
import { type LoginFormData } from '../model/types';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  loading: boolean;
  onInputChange: () => void;
  shouldHighlightEmail: boolean;
  shouldHighlightPassword: boolean;
}

export function LoginForm({
  onSubmit,
  loading,
  onInputChange,
  shouldHighlightEmail,
  shouldHighlightPassword,
}: LoginFormProps) {
  const form = useFormContext<LoginFormData>();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
                    onInputChange();
                  }}
                  className={shouldHighlightEmail ? 'border-destructive' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
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
                    onInputChange();
                  }}
                  className={shouldHighlightPassword ? 'border-destructive' : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? AuthFormButtons.LOGIN.LOADING : AuthFormButtons.LOGIN.SUBMIT}
        </Button>
      </form>
    </Form>
  );
}
