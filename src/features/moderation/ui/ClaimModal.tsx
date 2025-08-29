'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { ClaimApproveReasons } from '@/shared/constants/ClaimApproveReasons';
import { Button } from '@/shared/ui/shadcnComponents/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcnComponents/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcnComponents/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcnComponents/select';
import { Textarea } from '@/shared/ui/shadcnComponents/textarea';
import { UIConstants } from '../constants/ui';
import { ClaimReportSchema } from '../model/schemas';
import { ClaimModalProps, ClaimReportFormData } from '../model/types';
import { createClaimReport } from '../server-actions/createClaimReport';

export function ClaimModal({
  isOpen,
  onClose,
  resourceId,
  resourceType,
  onSuccess,
}: ClaimModalProps) {
  const form = useForm<ClaimReportFormData>({
    resolver: zodResolver(ClaimReportSchema),
    defaultValues: {
      resourceId,
      resourceType,
      reason: '',
      message: '',
    },
  });

  const onSubmit = async (data: ClaimReportFormData) => {
    const formData = new FormData();
    formData.append('resourceId', data.resourceId);
    formData.append('resourceType', data.resourceType);
    formData.append('reason', data.reason);
    formData.append('message', data.message);

    startTransition(async () => {
      const result = await createClaimReport(formData);
      if (result.success) {
        form.reset();
        onClose();
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{UIConstants.MODAL_TITLE}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel id="reason-label">{UIConstants.REASON_LABEL}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger aria-labelledby="reason-label">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ClaimApproveReasons).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {String(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel id="message-label">{UIConstants.MESSAGE_LABEL}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      aria-labelledby="message-label"
                      aria-describedby="message-error"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage id="message-error" />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={form.formState.isSubmitting}
              >
                {UIConstants.CANCEL_BUTTON}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? UIConstants.SUBMITTING_BUTTON
                  : UIConstants.SUBMIT_BUTTON}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
