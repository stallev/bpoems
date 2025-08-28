import { z } from 'zod';
import { ClaimReportSchema } from './schemas';

export type ClaimReportFormData = z.infer<typeof ClaimReportSchema>;

export enum ClaimResourceType {
  POEM = 'POEM',
  COMMENT = 'COMMENT',
  REVIEW = 'REVIEW',
}

export interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
  resourceType: ClaimResourceType;
  onSuccess?: () => void;
}
