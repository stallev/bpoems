# Claim Report Structure Documentation

## Overview

This document describes the structure and functionality of the claim report system for content moderation in the Christian Poetry Platform. The system allows users to report inappropriate content and enables moderators to review and make decisions on these reports.

## Database Schema

### ClaimReport Model

The `ClaimReport` model in `prisma/schema.prisma` has been extended with a new field for rejection reasons:

```prisma
model ClaimReport {
  id                    String                @id @default(cuid())
  resourceType          ClaimResourceType // Type of resource (POEM, COMMENT, REVIEW)
  poemId                String? // Nullable if not a poem
  poem                  Poem?   @relation("PoemClaims", fields: [poemId], references: [id], onDelete: Cascade)
  commentId             String? // Nullable if not a comment
  comment               Comment? @relation("CommentClaims", fields: [commentId], references: [id], onDelete: Cascade)
  reviewId              String? // Nullable if not a review
  review                Review? @relation("ReviewClaims", fields: [reviewId], references: [id], onDelete: Cascade)
  message               String // User's message about the claim
  reporterId            String? // Nullable for unauthenticated users
  reporter              User?   @relation("ClaimReporter", fields: [reporterId], references: [id])
  claimResultDecision   ContentApprovalStatus? // APPROVED, REJECTED, or null if pending
  claimResultDecisionAt DateTime? // Timestamp of decision
  handlerId             String? // ID of Moderator/Admin who handled the claim
  handler               User?   @relation("ClaimHandler", fields: [handlerId], references: [id])
  claim_reject_decision_reason String? // Reason for rejection, required if claimResultDecision is REJECTED

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Indexes for performance
  @@index([resourceType])
  @@index([reporterId])
  @@index([handlerId])
  @@index([claimResultDecision])
  @@index([createdAt])
  @@index([poemId])
  @@index([commentId])
  @@index([reviewId])
}
```

### New Field: claim_reject_decision_reason

- **Type**: `String?` (nullable)
- **Purpose**: Stores the reason for rejecting a claim report
- **Validation**: Required when `claimResultDecision` is set to `REJECTED`
- **Values**: Must match one of the predefined reasons from `ClaimRejectReasons`

## Claim Rejection Reasons

### Structure

The rejection reasons are defined in `src/shared/constants/ClaimRejectReasons.ts`:

```typescript
export type ClaimRejectReason = {
  reasonId: string;
  reasonName: { RU: string; EN: string };
};

export const ClaimRejectReasons: ClaimRejectReason[] = [
  { 
    reasonId: 'INAPPROPRIATE_CONTENT', 
    reasonName: { 
      RU: 'Неприемлемый контент', 
      EN: 'Inappropriate content' 
    } 
  },
  { 
    reasonId: 'COPYRIGHT_VIOLATION', 
    reasonName: { 
      RU: 'Нарушение авторских прав', 
      EN: 'Copyright violation' 
    } 
  },
  { 
    reasonId: 'SPAM', 
    reasonName: { 
      RU: 'Спам', 
      EN: 'Spam' 
    } 
  },
  { 
    reasonId: 'OFFENSIVE_LANGUAGE', 
    reasonName: { 
      RU: 'Оскорбительный язык', 
      EN: 'Offensive language' 
    } 
  },
  { 
    reasonId: 'MISLEADING_INFORMATION', 
    reasonName: { 
      RU: 'Вводящая в заблуждение информация', 
      EN: 'Misleading information' 
    } 
  },
  { 
    reasonId: 'VIOLENCE_OR_HARM', 
    reasonName: { 
      RU: 'Насилие или причинение вреда', 
      EN: 'Violence or harm' 
    } 
  },
] as const;
```

### Available Reasons

1. **INAPPROPRIATE_CONTENT** - Content that violates community guidelines
2. **COPYRIGHT_VIOLATION** - Unauthorized use of copyrighted material
3. **SPAM** - Unwanted promotional or repetitive content
4. **OFFENSIVE_LANGUAGE** - Content containing offensive or inappropriate language
5. **MISLEADING_INFORMATION** - Content that spreads false or misleading information
6. **VIOLENCE_OR_HARM** - Content promoting violence or harm to others

### Utility Functions

```typescript
// Get rejection reason by ID
export function getRejectionReason(reasonId: string): ClaimRejectReason | undefined

// Get all rejection reason IDs
export function getRejectionReasonIds(): string[]
```

## Server Action: handleClaimReport

### Location
`src/features/moderation/server-actions/handleClaimReport.ts`

### Functionality

The Server Action handles claim reports with the following features:

1. **Authentication & Authorization**: Only moderators and admins can handle claims
2. **Validation**: Comprehensive validation using Zod schema
3. **Reason Validation**: Ensures rejection reasons are valid when rejecting claims
4. **Content Status Updates**: Automatically updates related content status when claims are approved
5. **Activity Logging**: Logs moderation activities for audit trail
6. **Cache Revalidation**: Revalidates relevant paths after processing

### Validation Schema

```typescript
const claimReportSchema = z.object({
  claimId: z.string(),
  claimResultDecision: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'PENDINGREVIEW']),
  claim_reject_decision_reason: z.string().optional().refine(
    (value) => !value || ClaimRejectReasons.some((reason) => reason.reasonId === value),
    { message: ErrorMessages.INVALID_REJECTION_REASON }
  ),
}).refine(
  (data) => data.claimResultDecision !== 'REJECTED' || !!data.claim_reject_decision_reason,
  { message: ErrorMessages.REJECTION_REASON_REQUIRED, path: ['claim_reject_decision_reason'] }
);
```

### Validation Rules

1. **Required Fields**: `claimId` and `claimResultDecision` are required
2. **Reason Validation**: When `claimResultDecision` is `REJECTED`, `claim_reject_decision_reason` is required
3. **Reason Format**: The rejection reason must match one of the predefined reasons
4. **Decision Values**: Only valid decision values are allowed

### Error Handling

The Server Action provides comprehensive error handling:

- **Authentication Errors**: Returns unauthorized error for non-moderators
- **Validation Errors**: Returns specific validation error messages
- **Database Errors**: Handles database operation failures gracefully
- **Content Not Found**: Returns error if claim report doesn't exist

### Usage Example

```typescript
// Form data for handling a claim
const formData = new FormData();
formData.append('claimId', 'claim-123');
formData.append('claimResultDecision', 'REJECTED');
formData.append('claim_reject_decision_reason', 'INAPPROPRIATE_CONTENT');

// Handle the claim
const result = await handleClaimReport(formData);

if (result.success) {
  console.log('Claim processed successfully:', result.data);
} else {
  console.error('Error processing claim:', result.message);
}
```

## Integration with Moderation System

### Content Status Updates

When a claim is approved, the related content status is automatically updated:

- **Poems**: Status set to `REJECTED`
- **Comments**: Status set to `REJECTED`
- **Reviews**: Status set to `REJECTED`

### Activity Logging

All claim handling activities are logged using the `logModerationActivity` function:

- **Action Types**: `CLAIM_APPROVE` or `CLAIM_REJECT`
- **Reason**: Stores the rejection reason for rejected claims
- **Audit Trail**: Provides complete audit trail for moderation activities

### Cache Revalidation

After processing claims, the following paths are revalidated:

- `RoutePath.POEMS` - For poem-related claims
- `RoutePath.DASHBOARD` - For dashboard updates
- `RoutePath.CLAIM_REPORTS` - For claim reports page

## Frontend Integration

### Form Components

The rejection reason field should be implemented as a select dropdown in the claim handling form:

```tsx
<Select onValueChange={field.onChange} defaultValue={field.value}>
  <SelectTrigger>
    <SelectValue placeholder="Выберите причину отказа" />
  </SelectTrigger>
  <SelectContent>
    {ClaimRejectReasons.map(reason => (
      <SelectItem key={reason.reasonId} value={reason.reasonId}>
        {reason.reasonName.RU}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

### Conditional Display

The rejection reason field should only be displayed when the decision is set to `REJECTED`:

```tsx
{claimResultDecision === 'REJECTED' && (
  <FormField
    control={form.control}
    name="claim_reject_decision_reason"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Причина отказа</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          {/* Select options */}
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
)}
```

## Error Messages

The following error messages are used in the claim handling system:

- `ErrorMessages.UNAUTHORIZED` - User is not authorized to handle claims
- `ErrorMessages.INVALID_REJECTION_REASON` - Invalid rejection reason provided
- `ErrorMessages.REJECTION_REASON_REQUIRED` - Rejection reason is required when rejecting
- `ErrorMessages.CLAIM_NOT_FOUND` - Claim report not found
- `ErrorMessages.HANDLE_CLAIM_REPORT_FAILED` - General error handling claim report
- `ErrorMessages.VALIDATION_ERROR` - General validation error

## Best Practices

### Security

1. **Authorization**: Always verify user role before allowing claim handling
2. **Input Validation**: Validate all inputs using Zod schemas
3. **SQL Injection Prevention**: Use Prisma ORM for safe database operations
4. **XSS Prevention**: Sanitize user inputs before processing

### Performance

1. **Database Indexes**: Use appropriate indexes for efficient queries
2. **Cache Revalidation**: Revalidate only necessary paths
3. **Error Handling**: Provide meaningful error messages without exposing internals

### User Experience

1. **Clear Feedback**: Provide clear success/error messages
2. **Validation**: Show validation errors immediately
3. **Accessibility**: Ensure form elements are accessible
4. **Multilingual Support**: Support both Russian and English interfaces

## Testing Considerations

### Unit Tests

1. **Validation Tests**: Test all validation scenarios
2. **Authorization Tests**: Test role-based access control
3. **Error Handling Tests**: Test error scenarios
4. **Database Tests**: Test database operations

### Integration Tests

1. **End-to-End Tests**: Test complete claim handling workflow
2. **Cache Tests**: Verify cache revalidation works correctly
3. **Activity Logging Tests**: Verify moderation activities are logged

### Manual Testing

1. **Role Testing**: Test with different user roles
2. **Validation Testing**: Test form validation
3. **Error Testing**: Test error scenarios
4. **UI Testing**: Test user interface functionality

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
