import { z } from 'zod';
import { ClaimResourceType } from './types';

export const ClaimReportSchema = z.object({
  resourceId: z.string().min(1, 'Resource ID is required'),
  resourceType: z.nativeEnum(ClaimResourceType),
  reason: z.string().min(10, 'Please provide a detailed reason (minimum 10 characters)'),
  message: z.string().min(1, 'Message is required'),
});
