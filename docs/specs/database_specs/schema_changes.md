# Database Schema Changes Documentation

## Overview

This document tracks changes made to the Prisma schema (`prisma/schema.prisma`) for the Christian Poetry Platform.

## Latest Changes (Migration: 20250826134106_update_schema)

### Added Models

#### ModerationActivity Model
- **Purpose**: Logging moderation activities for audit trail
- **Fields**:
  - `id`: String (Primary key, cuid)
  - `activityType`: String (Type of moderation activity)
  - `description`: String (Description of the activity)
  - `moderatorId`: String (ID of the moderator who performed the activity)
  - `targetUserId`: String? (ID of the user affected by the activity)
  - `resourceType`: String? (Type of resource affected)
  - `resourceId`: String? (ID of the resource affected)
  - `metadata`: Json? (Additional metadata about the activity)
  - `createdAt`: DateTime (Timestamp of the activity)

#### Relations
- **ModeratorActivities**: Many-to-one relation with User (moderator who performed the activity)
- **TargetUserActivities**: Many-to-one relation with User (user affected by the activity)

#### Indexes
- `@@index([activityType])` - For filtering by activity type
- `@@index([moderatorId])` - For finding activities by moderator
- `@@index([targetUserId])` - For finding activities affecting a user
- `@@index([createdAt])` - For sorting by creation date

### Updated Models

#### ClaimReport Model
- **Added Field**: `claimRejectDecisionReason`: String? (Reason for rejecting the claim)
- **Purpose**: Provides detailed information about why a claim was rejected
- **Usage**: Used by moderators to provide specific feedback when rejecting claims

### Migration Details

#### Migration File: `20250826134106_update_schema`
- **Applied**: Successfully applied to database
- **Status**: Database is now in sync with schema
- **Prisma Client**: Regenerated successfully

### Impact Analysis

#### Backward Compatibility
- **ModerationActivity**: New model, no impact on existing data
- **ClaimReport**: Added optional field, existing data remains intact

#### Performance Considerations
- **Indexes**: Added performance indexes for efficient querying of moderation activities
- **Relations**: Proper foreign key constraints ensure data integrity

#### Security Implications
- **Audit Trail**: ModerationActivity provides comprehensive logging of all moderation actions
- **Data Integrity**: Foreign key constraints prevent orphaned records

## Previous Changes

### Initial Schema (Migration: 20250807193952_init)
- Created base models: User, Account, VerificationToken
- Established authentication foundation

### Auth Models (Migration: 20250809110403_init_auth_models)
- Added authentication-related models
- Configured NextAuth.js integration

### Schema Corrections (Migration: 20250809180516_correct_schema)
- Fixed schema inconsistencies
- Improved model relationships

### Opposite Relations (Migration: 20250819143207_add_opposite_relations)
- Added bidirectional relationships
- Enhanced data querying capabilities

### Poem Statistics (Migration: 20250820102501_add_poem_statistics_one_to_one_relation)
- Added Statistics model for poem analytics
- Implemented one-to-one relationship with Poem

### Claim Reports (Migration: 20250825094237_remove_claim_reports_uniqueness)
- Removed uniqueness constraints from claim reports
- Allowed multiple claims per resource

### Claim Reject Reason (Migration: 20250826000000_add_claim_reject_reason)
- Added claim rejection reason field
- Enhanced claim reporting system

## Future Considerations

### Planned Enhancements
- **Tag System**: Ready for implementation (models exist in schema)
- **Advanced Analytics**: Statistics model provides foundation
- **Content Moderation**: Complete moderation workflow implemented

### Performance Optimizations
- **Index Strategy**: Current indexes optimized for common query patterns
- **Query Optimization**: Prisma Client provides efficient query generation

### Scalability
- **Database Design**: Normalized schema supports growth
- **Migration Strategy**: Incremental migrations ensure smooth updates

## Testing Recommendations

### Schema Validation
- Run `npx prisma validate` before each migration
- Test migrations on development database first
- Verify data integrity after migration

### Application Testing
- Test all CRUD operations with new models
- Verify foreign key constraints work correctly
- Test performance with realistic data volumes

### Integration Testing
- Test moderation workflow end-to-end
- Verify claim reporting system functionality
- Test audit trail logging

## Documentation Standards

### Schema Documentation
- All models must have clear comments explaining their purpose
- Field descriptions should be comprehensive
- Relation comments should explain the business logic

### Migration Documentation
- Each migration should be documented here
- Include purpose, impact, and testing notes
- Track any breaking changes or data migrations

### API Documentation
- Repository methods should be documented
- Type definitions should be clear and comprehensive
- Server Actions should include proper error handling

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [Date + 2 weeks]
