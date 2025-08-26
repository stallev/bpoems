# Moderation Activity Structure Documentation

## Overview

This document describes the structure and functionality of the moderation activity tracking system in the Christian Poetry Platform. The system logs all moderation actions performed by moderators and administrators to provide a complete audit trail and ensure accountability.

## Database Schema

### ModerationActionType Enum

The `ModerationActionType` enum in `prisma/schema.prisma` defines all possible moderation actions:

```prisma
enum ModerationActionType {
  AUTHOR_REQUEST_APPROVE
  AUTHOR_REQUEST_REJECT
  USER_BAN
  USER_SUSPEND
  CONTENT_APPROVE
  CONTENT_REJECT
  CLAIM_APPROVE
  CLAIM_REJECT
}
```

### ModerationActivity Model

The `ModerationActivity` model tracks all moderation actions:

```prisma
model ModerationActivity {
  id              String              @id @default(cuid())
  actionType      ModerationActionType // Type of moderation action
  moderatorId     String              // ID of the moderator/admin performing the action
  moderator       User                @relation("ModeratorActivities", fields: [moderatorId], references: [id])
  targetUserId    String?             // ID of the affected user (if applicable)
  targetUser      User?               @relation("TargetUserActivities", fields: [targetUserId], references: [id])
  poemId          String?             // ID of the affected poem (if applicable)
  poem            Poem?               @relation(fields: [poemId], references: [id], onDelete: Cascade)
  commentId       String?             // ID of the affected comment (if applicable)
  comment         Comment?            @relation(fields: [commentId], references: [id], onDelete: Cascade)
  reviewId        String?             // ID of the affected review (if applicable)
  review          Review?             @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  claimReportId   String?             // ID of the affected claim report (if applicable)
  claimReport     ClaimReport?        @relation(fields: [claimReportId], references: [id], onDelete: Cascade)
  reason          String?             // Optional reason for the action (e.g., rejection reason)
  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  @@index([moderatorId])
  @@index([targetUserId])
  @@index([poemId])
  @@index([commentId])
  @@index([reviewId])
  @@index([claimReportId])
  @@index([createdAt])
}
```

## Action Types

### Author Request Management
- **AUTHOR_REQUEST_APPROVE**: When a moderator/admin approves a user's request for author role
- **AUTHOR_REQUEST_REJECT**: When a moderator/admin rejects a user's request for author role

### User Management
- **USER_BAN**: When a moderator/admin permanently bans a user
- **USER_SUSPEND**: When a moderator/admin temporarily suspends a user

### Content Moderation
- **CONTENT_APPROVE**: When a moderator/admin approves content (poem, comment, review)
- **CONTENT_REJECT**: When a moderator/admin rejects content (poem, comment, review)

### Claim Report Handling
- **CLAIM_APPROVE**: When a moderator/admin approves a claim report
- **CLAIM_REJECT**: When a moderator/admin rejects a claim report

## Server Action: logModerationActivity

### Location
`src/features/moderation/server-actions/logModerationActivity.ts`

### Functionality

The Server Action logs moderation activities with the following features:

1. **Authentication & Authorization**: Only moderators and admins can log activities
2. **Validation**: Comprehensive validation using Zod schema
3. **Flexible Logging**: Supports logging activities for different types of content
4. **Reason Tracking**: Optional reason field for actions that require justification
5. **Audit Trail**: Complete audit trail for all moderation activities

### Validation Schema

```typescript
const logModerationActivitySchema = z.object({
  actionType: z.enum([
    'AUTHOR_REQUEST_APPROVE',
    'AUTHOR_REQUEST_REJECT',
    'USER_BAN',
    'USER_SUSPEND',
    'CONTENT_APPROVE',
    'CONTENT_REJECT',
    'CLAIM_APPROVE',
    'CLAIM_REJECT',
  ]),
  targetUserId: z.string().optional(),
  poemId: z.string().optional(),
  commentId: z.string().optional(),
  reviewId: z.string().optional(),
  claimReportId: z.string().optional(),
  reason: z.string().optional(),
});
```

### Usage Examples

#### Logging Author Request Approval
```typescript
await logModerationActivity({
  actionType: 'AUTHOR_REQUEST_APPROVE',
  targetUserId: 'user-123',
  reason: 'User demonstrated good content quality'
});
```

#### Logging User Ban
```typescript
await logModerationActivity({
  actionType: 'USER_BAN',
  targetUserId: 'user-456',
  reason: 'Repeated violations of community guidelines'
});
```

#### Logging Content Rejection
```typescript
await logModerationActivity({
  actionType: 'CONTENT_REJECT',
  poemId: 'poem-789',
  reason: 'Inappropriate content'
});
```

#### Logging Claim Report Handling
```typescript
await logModerationActivity({
  actionType: 'CLAIM_REJECT',
  claimReportId: 'claim-123',
  reason: 'Claim was unfounded'
});
```

## Integration with Other Systems

### User Model Relations

The `User` model includes relations to track moderation activities:

```prisma
model User {
  // ... other fields ...
  
  // Activities performed by this user (as moderator/admin)
  moderationActivities   ModerationActivity[] @relation("ModeratorActivities")
  
  // Activities affecting this user (as target)
  targetUserActivities   ModerationActivity[] @relation("TargetUserActivities")
}
```

### Content Model Relations

Content models include relations to track moderation activities:

```prisma
model Poem {
  // ... other fields ...
  moderationActivities ModerationActivity[]
}

model Comment {
  // ... other fields ...
  moderationActivities ModerationActivity[]
}

model Review {
  // ... other fields ...
  moderationActivities ModerationActivity[]
}

model ClaimReport {
  // ... other fields ...
  moderationActivities ModerationActivity[]
}
```

## Use Cases

### 1. Author Request Processing

When a moderator processes an author role request:

```typescript
// Approve request
await logModerationActivity({
  actionType: 'AUTHOR_REQUEST_APPROVE',
  targetUserId: requesterId,
  reason: 'User demonstrated good content quality and community engagement'
});

// Reject request
await logModerationActivity({
  actionType: 'AUTHOR_REQUEST_REJECT',
  targetUserId: requesterId,
  reason: 'Insufficient content quality or community engagement'
});
```

### 2. User Management

When a moderator manages user accounts:

```typescript
// Suspend user
await logModerationActivity({
  actionType: 'USER_SUSPEND',
  targetUserId: userId,
  reason: 'Temporary suspension for community guideline violations'
});

// Ban user
await logModerationActivity({
  actionType: 'USER_BAN',
  targetUserId: userId,
  reason: 'Permanent ban for repeated serious violations'
});
```

### 3. Content Moderation

When a moderator moderates content:

```typescript
// Approve content
await logModerationActivity({
  actionType: 'CONTENT_APPROVE',
  poemId: poemId,
  reason: 'Content meets community guidelines'
});

// Reject content
await logModerationActivity({
  actionType: 'CONTENT_REJECT',
  poemId: poemId,
  reason: 'Content violates community guidelines'
});
```

### 4. Claim Report Handling

When a moderator handles claim reports:

```typescript
// Approve claim
await logModerationActivity({
  actionType: 'CLAIM_APPROVE',
  claimReportId: claimId,
  reason: 'Claim was valid, content removed'
});

// Reject claim
await logModerationActivity({
  actionType: 'CLAIM_REJECT',
  claimReportId: claimId,
  reason: 'Claim was unfounded, content remains'
});
```

## Querying Moderation Activities

### Get Activities by Moderator

```typescript
const moderatorActivities = await prisma.moderationActivity.findMany({
  where: { moderatorId: moderatorId },
  include: {
    moderator: true,
    targetUser: true,
    poem: true,
    comment: true,
    review: true,
    claimReport: true,
  },
  orderBy: { createdAt: 'desc' },
});
```

### Get Activities by Target User

```typescript
const userActivities = await prisma.moderationActivity.findMany({
  where: { targetUserId: userId },
  include: {
    moderator: true,
    targetUser: true,
  },
  orderBy: { createdAt: 'desc' },
});
```

### Get Activities by Action Type

```typescript
const banActivities = await prisma.moderationActivity.findMany({
  where: { actionType: 'USER_BAN' },
  include: {
    moderator: true,
    targetUser: true,
  },
  orderBy: { createdAt: 'desc' },
});
```

### Get Recent Activities

```typescript
const recentActivities = await prisma.moderationActivity.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    },
  },
  include: {
    moderator: true,
    targetUser: true,
  },
  orderBy: { createdAt: 'desc' },
});
```

## Dashboard Integration

### Moderation Activity Dashboard

The moderation activity system integrates with the dashboard to provide:

1. **Activity Feed**: Real-time feed of recent moderation activities
2. **Moderator Performance**: Statistics on moderator activity and decision patterns
3. **Audit Reports**: Detailed reports for compliance and accountability
4. **Activity Search**: Search and filter moderation activities by various criteria

### Dashboard Components

```tsx
// Activity feed component
<ModerationActivityFeed activities={recentActivities} />

// Moderator performance component
<ModeratorPerformanceStats moderatorId={moderatorId} />

// Activity search component
<ModerationActivitySearch onSearch={handleSearch} />
```

## Security Considerations

### Access Control

1. **Role-Based Access**: Only moderators and admins can log activities
2. **Audit Trail**: All activities are logged with moderator identification
3. **Data Integrity**: Activities cannot be deleted or modified once logged
4. **Privacy Protection**: Sensitive information is handled appropriately

### Data Retention

1. **Permanent Logging**: Moderation activities are permanently logged
2. **Backup Strategy**: Activities are included in regular database backups
3. **Compliance**: Logging meets regulatory and compliance requirements

## Performance Considerations

### Database Optimization

1. **Indexes**: Appropriate indexes for efficient querying
2. **Pagination**: Large activity lists are paginated
3. **Caching**: Frequently accessed activity data is cached
4. **Archiving**: Old activities can be archived for performance

### Query Optimization

1. **Selective Loading**: Only necessary fields are loaded
2. **Efficient Joins**: Optimized joins for related data
3. **Query Limits**: Reasonable limits on query results

## Error Handling

### Validation Errors

```typescript
if (error instanceof z.ZodError) {
  return {
    success: false,
    message: error.errors[0]?.message || ErrorMessages.VALIDATION_ERROR,
  };
}
```

### Database Errors

```typescript
if (error instanceof Prisma.PrismaClientKnownRequestError) {
  return {
    success: false,
    message: ErrorMessages.DATABASE_ERROR,
  };
}
```

### Authorization Errors

```typescript
if (!session?.user || !['MODERATOR', 'ADMIN'].includes(session.user.role)) {
  return { success: false, message: ErrorMessages.UNAUTHORIZED };
}
```

## Testing Considerations

### Unit Tests

1. **Validation Tests**: Test all validation scenarios
2. **Authorization Tests**: Test role-based access control
3. **Database Tests**: Test database operations
4. **Error Handling Tests**: Test error scenarios

### Integration Tests

1. **End-to-End Tests**: Test complete moderation workflows
2. **Dashboard Tests**: Test dashboard integration
3. **Performance Tests**: Test query performance

### Manual Testing

1. **Role Testing**: Test with different user roles
2. **Activity Logging**: Verify activities are logged correctly
3. **Dashboard Testing**: Test dashboard functionality

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
