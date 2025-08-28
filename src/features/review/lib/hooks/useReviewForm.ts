import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ReviewFormSchema, type ReviewFormData } from '../../model/schemas';

interface UseReviewFormProps {
  poemId: string;
  onSuccess?: () => void;
}

export function useReviewForm({ poemId }: UseReviewFormProps) {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      content: '',

      poemId,
    },
  });

  const handleSubmit = (data: ReviewFormData) => {
    const formData = new FormData();
    formData.append('content', data.content);
    if (data.rating !== undefined) {
      formData.append('rating', data.rating.toString());
    }
    formData.append('poemId', data.poemId);
    return formData;
  };

  return { form, handleSubmit };
}
