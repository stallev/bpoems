'use client';

import { useRouter } from 'next/navigation';
import { PoemForm } from './PoemForm';
import type { PoemFormProps } from '../model/types';

/**
 * Wrapper component for PoemForm that handles navigation on cancel
 */
export function PoemFormWrapper(props: PoemFormProps) {
  const router = useRouter();

  const handleCancel = () => {
    // Go back to previous page in navigation history
    router.back();
  };

  return <PoemForm {...props} onCancel={handleCancel} />;
}
