# Poem-Statistics One-to-One Relation Documentation

## Overview

This document describes the one-to-one relationship between `Poem` and `Statistics` entities, which allows tracking various metrics for each poem (views, edits, likes, shares).

## Database Schema

### Models

#### Poem Model
```prisma
model Poem {
  id          String                @id @default(cuid())
  title       String
  content     Json
  description String?
  authorId    String
  author      User                  @relation(fields: [authorId], references: [id])
  status      ContentApprovalStatus @default(APPROVED)
  categoryId  String?
  category    Category?             @relation("PoemCategory", fields: [categoryId], references: [id], onDelete: Cascade)
  tags        Tag[]
  statistics  Statistics?           @relation("PoemStatistics") // One-to-one relation
  
  // Timestamps
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime?
  
  // Other relations
  comments        Comment[]
  ratings         Rating[]
  reviews         Review[]
  ReadingListItem ReadingListItem[]
}
```

#### Statistics Model
```prisma
model Statistics {
  id        String @id @default(cuid())
  poemId    String @unique
  poem      Poem   @relation("PoemStatistics", fields: [poemId], references: [id], onDelete: Cascade)
  views     Int    @default(0)
  edits     Int    @default(0)
  likes     Int    @default(0)
  shares    Int    @default(0)
  
  @@index([views])
  @@index([edits])
  @@index([poemId])
}
```

## Relationship Characteristics

### One-to-One Relationship
- Each `Poem` can have exactly one `Statistics` record
- Each `Statistics` record belongs to exactly one `Poem`
- The relationship is enforced by `@unique` constraint on `poemId` in Statistics

### Cascade Delete
- When a `Poem` is deleted, the corresponding `Statistics` record is automatically deleted
- This is implemented using `onDelete: Cascade` in the Statistics model

### Optional Relationship
- The relationship is optional from the Poem side (`statistics?: Statistics?`)
- Statistics are created automatically when needed (lazy creation)

## TypeScript Types

### PoemWithRelations Interface
```typescript
export interface PoemWithRelations extends PrismaPoem {
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  category: {
    id: string;
    name: Record<string, string>;
  } | null;
  tags: Tag[];
  comments?: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string | null;
    };
  }[];
  statistics?: Statistics | null; // Added statistics relation
}
```

### Simplified Input Types
```typescript
export type SimplePoemCreateInput = Omit<
  Prisma.PoemUncheckedCreateInput,
  'category' | 'tags' | 'statistics'
> & {
  category?: {
    connect?: { id: string };
  };
  tags?: {
    create?: { tagId: string }[];
    connect?: { tagId: string }[];
  };
  statistics?: {
    create?: { views: number; edits: number; likes: number; shares: number };
  };
};

export type SimplePoemUpdateInput = Omit<
  Prisma.PoemUncheckedUpdateInput,
  'category' | 'tags' | 'statistics'
> & {
  category?: {
    connect?: { id: string };
    disconnect?: boolean;
  };
  tags?: {
    create?: { tagId: string }[];
    connect?: { tagId: string }[];
    disconnect?: { tagId: string }[];
  };
  statistics?: {
    update?: { views?: number; edits?: number; likes?: number; shares?: number };
  };
};
```

## Repository Methods

### Statistics Increment Methods
The `poemRepository` provides methods to increment various statistics:

```typescript
// Increment views count
incrementViews: async (poemId: string): Promise<void>

// Increment edits count
incrementEdits: async (poemId: string): Promise<void>

// Increment likes count
incrementLikes: async (poemId: string): Promise<void>

// Increment shares count
incrementShares: async (poemId: string): Promise<void>
```

### Implementation Details
```typescript
incrementViews: async (poemId: string): Promise<void> => {
  const stats = await prisma.statistics.findFirst({ 
    where: { poem: { id: poemId } } 
  });
  
  if (!stats) {
    // Create statistics if they don't exist
    await prisma.statistics.create({
      data: { 
        poem: { connect: { id: poemId } }, 
        views: 1, 
        edits: 0, 
        likes: 0, 
        shares: 0 
      },
    });
  } else {
    // Increment existing statistics
    await prisma.statistics.update({
      where: { id: stats.id },
      data: { views: { increment: 1 } },
    });
  }
}
```

## Usage Examples

### Creating a Poem with Statistics
```typescript
const newPoem = await poemRepository.create({
  title: "My Poem",
  content: { /* rich text content */ },
  authorId: "user-id",
  statistics: {
    create: {
      views: 0,
      edits: 0,
      likes: 0,
      shares: 0
    }
  }
});
```

### Incrementing Statistics
```typescript
// When a user views a poem
await poemRepository.incrementViews(poemId);

// When a user likes a poem
await poemRepository.incrementLikes(poemId);

// When a user shares a poem
await poemRepository.incrementShares(poemId);

// When a poem is edited
await poemRepository.incrementEdits(poemId);
```

### Retrieving Poem with Statistics
```typescript
const poemWithStats = await poemRepository.findById(poemId);
console.log(`Poem "${poemWithStats.title}" has ${poemWithStats.statistics?.views || 0} views`);
```

## Database Migration

### Migration Steps
1. **Create Statistics table** (if not exists)
2. **Add poemId field** with unique constraint
3. **Add foreign key relationship** to Poem table
4. **Add cascade delete** constraint
5. **Create indexes** for performance

### Migration Command
```bash
npx prisma migrate dev --name add_poem_statistics_one_to_one_relation
```

## Performance Considerations

### Indexes
- `@@index([poemId])` - Fast lookups by poem ID
- `@@index([views])` - Fast sorting by views
- `@@index([edits])` - Fast sorting by edits

### Query Optimization
- Statistics are loaded with poems using `include: { statistics: true }`
- Lazy creation of statistics prevents unnecessary database records
- Cascade delete ensures data consistency

## Data Integrity

### Constraints
- **Unique Constraint**: `poemId` is unique in Statistics table
- **Foreign Key**: `poemId` references `Poem.id`
- **Cascade Delete**: Deleting a Poem automatically deletes its Statistics

### Validation
- Statistics are automatically created when first accessed
- All counter fields default to 0
- No negative values allowed (enforced by Prisma)

## Error Handling

### Common Scenarios
1. **Poem not found**: Methods return null or throw appropriate errors
2. **Statistics not found**: Automatically created with default values
3. **Database constraints**: Prisma handles foreign key violations

### Best Practices
- Always check if statistics exist before updating
- Use transactions for critical operations
- Handle cascade delete effects in application logic

## Future Enhancements

### Potential Improvements
1. **Additional Metrics**: Add more statistics fields (comments, ratings, etc.)
2. **Time-based Tracking**: Track statistics over time periods
3. **Analytics**: Add aggregation methods for reporting
4. **Caching**: Implement Redis caching for frequently accessed statistics

### Migration Path
- Current structure supports easy addition of new statistics fields
- Backward compatibility maintained through optional relationships
- Existing data can be migrated without downtime
