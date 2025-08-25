'use client';

import { Loader2, Save, Send } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { Alert, AlertDescription } from '@/shared/ui/shadcnComponents/alert';
import { Button } from '@/shared/ui/shadcnComponents/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcnComponents/card';
import { Switch } from '@/shared/ui/shadcnComponents/switch';
import { PoemContentEditor } from './PoemContentEditor';
import { PoemMetadataFields } from './PoemMetadataFields';
import { useCategories } from '../lib/hooks/useCategories';
import { usePoemForm } from '../lib/hooks/usePoemForm';

// Local constants to avoid import issues
const POEM_LABELS = {
  IS_PUBLISHED: 'Publish immediately',
  SAVE_DRAFT: 'Save as draft',
  PUBLISH: 'Publish',
  UPDATE: 'Update',
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  PUBLISHING: 'Publishing...',
};

// Define types locally to avoid import issues
interface PoemContentBlock {
  order: number;
  textType: 'paragraph' | 'image' | 'heading' | 'quote' | 'break';
  content: string;
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    color?: string;
    backgroundColor?: string;
  } | null;
  emoji: string | null;
  altText: string | null;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
  customStyles?: Record<string, unknown>;
}

interface PoemFormData {
  title: string;
  slug: string;
  description?: string;
  content: PoemContentBlock[];
  categoryId?: string;
  tags: string[];
  isPublished: boolean;
  language: 'EN' | 'RU' | 'UA';
}

interface PoemFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<PoemFormData>;
  onSubmit: (data: PoemFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const PoemForm = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading: externalLoading,
}: PoemFormProps) => {
  const {
    form,
    isLoading: internalLoading,
    error,
    handleSubmit,
  } = usePoemForm({
    mode,
    initialData,
    onSubmit,
  });

  const { categories } = useCategories();

  const isLoading = externalLoading || internalLoading;
  const isPublished = form.watch('isPublished');

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Metadata Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Poem Details</CardTitle>
              </CardHeader>
              <CardContent>
                <PoemMetadataFields
                  form={form}
                  categories={categories}
                  availableTags={[]} // Tags are not loaded for create mode
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                <PoemContentEditor initialContent={initialData?.content} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">
                      {isPublished ? POEM_LABELS.IS_PUBLISHED : POEM_LABELS.SAVE_DRAFT}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {isPublished
                        ? 'This poem will be published immediately'
                        : 'Save as draft for later editing'}
                    </p>
                  </div>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={checked => form.setValue('isPublished', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isPublished ? (
                    <Send className="mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isLoading
                    ? POEM_LABELS.LOADING
                    : isPublished
                      ? POEM_LABELS.PUBLISH
                      : mode === 'edit'
                        ? POEM_LABELS.UPDATE
                        : POEM_LABELS.SAVE_DRAFT}
                </Button>

                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onCancel}
                    disabled={isLoading}
                  >
                    {POEM_LABELS.CANCEL}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Form Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="capitalize">{mode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={isPublished ? 'text-green-600' : 'text-yellow-600'}>
                    {isPublished ? 'Will be published' : 'Draft'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
