import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CommentFormSchema, type CommentFormData } from '../../model/schemas';

interface UseCommentFormProps {
  poemId: string;
  onSuccess?: () => void;
}

export function useCommentForm({ poemId }: UseCommentFormProps) {
  const form = useForm<CommentFormData>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      content: '',
      poemId,
    },
  });

  const handleSubmit = (data: CommentFormData) => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('poemId', data.poemId);
    return formData;
  };

  return { form, handleSubmit };
}
