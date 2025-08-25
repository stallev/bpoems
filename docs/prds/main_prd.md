# Product Requirements Document: Christian Poetry Platform

## Introduction/Overview

This document outlines the requirements for a Christian poetry platform that serves as a modern, user-friendly space for Christian poets to publish their work and build a community of readers. The platform aims to solve the problem of limited modern publishing options for Christian poets while creating an engaging community for both writers and readers.

**Goal:** Create a comprehensive platform that enables Christian poets to publish their work, receive feedback, and build meaningful connections with readers, while providing readers with access to quality Christian poetry.

## Goals

### MVP Goals
1. Enable Christian poets to create accounts and publish their poetry
2. Provide readers with easy access to browse and read Christian poetry
3. Implement basic categorization and search functionality
4. Create a simple, intuitive user interface
5. Establish basic community features (comments, profiles)
6. Implement content moderation system with claim reports
7. Provide comprehensive content management dashboard

### Advanced Goals
1. Implement comprehensive rating and review system
2. Add advanced content moderation capabilities
3. Enhance community engagement features
4. Provide advanced analytics for poets
5. Implement premium features and monetization options

## User Stories

### MVP User Stories

**For Authors:**
- As a Christian author, I want to create an account so that I can publish my poetry
- As a Christian author, I want to publish my poems with proper formatting using a WYSIWYG editor so that they display beautifully
- As a Christian author, I want to categorize my poems by genre and add tags so that readers can easily find them
- As a Christian author, I want to edit and manage my published poems so that I can maintain quality
- As a Christian author, I want to view my profile and published works so that I can track my activity
- As an author, I want my content to be published immediately without moderation so that I can share my work quickly
- As a user, I want to edit my profile bio using a WYSIWYG editor so that I can create rich, formatted descriptions
- As a user, I want to provide my profile information in multiple languages so that international readers can understand me better
- As an author, I want to create poems with custom slugs so that I can have SEO-friendly URLs
- As an author, I want to edit my poems at `/profile/edit-poem/[poemSlug]` so that I can easily manage my content

**For Readers (Unauthenticated):**
- As a reader, I want to browse Christian poetry by categories and tags so that I can find content I enjoy
- As a reader, I want to search for specific poems or authors with full-text search so that I can discover new content
- As a reader, I want to read poems in a clean, distraction-free format so that I can focus on the content
- As a reader, I want to view author profiles so that I can learn more about the authors
- As a reader, I want to use the platform in my preferred language so that I can navigate comfortably
- As a reader, I want to report inappropriate content using the claim button so that I can help maintain community standards

**For Subscribers (Authenticated):**
- As a subscriber, I want to browse and read all published poems so that I can enjoy Christian poetry
- As a subscriber, I want to leave comments on poems so that I can engage with the community
- As a subscriber, I want to view author profiles so that I can learn more about the authors
- As a subscriber, I want to request an author role upgrade from my profile page so that I can publish my own poetry
- As a subscriber, I want to receive notifications about new posts from authors I follow so that I can stay updated
- As a subscriber, I want to use the platform in my preferred language so that I can navigate comfortably
- As a subscriber, I want to follow favorite authors so that I can stay updated on their new work
- As a subscriber, I want to rate and review poems so that I can provide feedback to authors
- As a subscriber, I want to create reading lists so that I can save poems for later
- As a subscriber, I want to report inappropriate content so that I can help maintain community standards
- As a subscriber, I want to create poems at `/profile/add-poem` so that I can publish my work

### Advanced User Stories

**For Authors:**
- As a Christian author, I want to receive ratings and reviews on my work so that I can improve
- As an author, I want to see analytics about my poems' performance so that I can understand reader engagement
- As an author, I want to moderate comments on my poems so that I can maintain a positive environment
- As an author, I want to create collections of my poems so that I can organize my work

**For Moderators:**
- As a moderator, I want to approve or reject author role requests from subscribers so that I can control who can publish content
- As a moderator, I want to review and moderate user-generated content so that I can maintain community standards
- As a moderator, I want to manage content reports and flags so that I can address inappropriate content
- As a moderator, I want to create and manage poem categories so that I can organize content effectively
- As a moderator, I want to provide category names in multiple languages so that all users can understand them
- As a moderator, I want to temporarily suspend users who violate community guidelines
- As a moderator, I want to review claim reports in the dashboard so that I can handle content moderation efficiently
- As a moderator, I want to make decisions on claim reports so that I can maintain content quality
- As a moderator, I want to see the status of all reported content so that I can track moderation progress

**For Administrators:**
- As an administrator, I want to approve or reject author role requests from subscribers so that I can control who can publish content
- As an administrator, I want to assign moderator roles to users so that I can delegate content moderation responsibilities
- As an administrator, I want to manage all user accounts and roles so that I can ensure platform safety
- As an administrator, I want to view platform analytics so that I can understand usage patterns
- As an administrator, I want to permanently ban users who repeatedly violate community guidelines
- As an administrator, I want to manage system configuration so that I can control platform settings
- As an administrator, I want to access comprehensive claim reports management so that I can oversee content moderation

## Functional Requirements

### MVP Requirements

#### Authentication & User Management
1. The system must allow users to register with email and password
2. The system must allow users to log in with their credentials
3. The system must allow users to reset their password
4. The system must maintain user profiles with basic information (name, bio, avatar)
5. The system must allow users to edit their profile information using a WYSIWYG editor for bio content
6. The system must implement a role-based access control system with hierarchical permissions
7. The system must require moderator approval for author role assignment
8. The system must automatically publish content from users with author role (approval status = 'approved')
9. The system must allow subscribers to request author role upgrade from their profile page
10. Authentication Providers (MVP and future): For MVP, the platform will support Email/Password (Credentials) and Google via NextAuth v5 using JWT tokens (stateless). Future releases will add Apple and Facebook providers.

#### Poetry Publishing
11. The system must allow only users with author role or higher to create new poems
12. The system must support rich text formatting for poems using a WYSIWYG editor (React Quill)
13. The system must allow poets to add titles and descriptions to their poems
14. The system must allow poets to categorize their poems by genre
15. The system must implement a tagging system for poems to improve content organization and discovery
16. The system must allow only users with author role or higher to edit and delete their own poems
17. The system must display poems in a clean, readable format
18. The system must allow moderators and admins to create and manage poem categories
19. The system must support multilingual categories with translations for all interface languages
20. The system must allow authors to create custom slugs for their poems based on the title
21. The system must provide a form for creating poems at `/profile/add-poem`
22. The system must provide a form for editing poems at `/profile/edit-poem/[poemSlug]`

#### Content Discovery
23. The system must display a homepage with featured and recent poems
24. The system must allow users to browse poems by category/genre
25. The system must allow users to filter poems by tags
26. The system must provide a search function for poems and poets with full-text search capabilities
27. The system must display individual poem pages with full content
28. The system must show related poems based on category and tags

#### Community Features
29. The system must allow only authenticated users (Subscriber role and above) to leave comments on poems
30. The system must allow poets to respond to comments on their poems
31. The system must display user profiles with their published poems
32. The system must show recent activity and poem counts on profiles
33. The system must allow authenticated users to rate and review poems
34. The system must allow authenticated users to create reading lists

#### Content Moderation & Claim Reports
35. The system must implement a claim report system for poems, comments, and reviews
36. The system must provide a "claim" button for each poem, comment, and review
37. The system must display a modal form for submitting claim reports with user messages
38. The system must store claim reports in the database with resource type, message, and reporter information
39. The system must automatically set content status to PENDINGREVIEW when claim is submitted by AUTHOR, MODERATOR, or ADMIN
40. The system must not change content status when claim is submitted by unauthenticated users or SUBSCRIBER role
41. The system must allow moderators and admins to review and make decisions on claim reports
42. The system must automatically set content status to REJECTED when claim is approved by moderator/admin
43. The system must track claim report decisions, timestamps, and handler information
44. The system must provide a dashboard page for managing claim reports

#### Basic Moderation
45. The system must allow users to report inappropriate content
46. The system must provide basic content filtering for offensive language

### Advanced Requirements

#### Enhanced User Experience
47. The system must implement a rating system (1-5 stars) for authenticated users only
48. The system must allow only authenticated users to write detailed reviews for poems
49. The system must provide a following system for authenticated users to follow poets
50. The system must allow authenticated users to create and manage reading lists
51. The system must implement a recommendation algorithm based on user preferences
52. The system must allow subscribers to receive notifications about new posts from followed authors

#### Content Management
53. The system must allow poets to create collections/anthologies of their work
54. The system must provide advanced search filters (date, rating, length, tags, etc.)
55. The system must support poem drafts and scheduled publishing
56. The system must allow poets to moderate comments on their own poems

#### Analytics & Insights
57. The system must provide poets with analytics on their poems (views, comments, ratings)
58. The system must show reading time estimates for poems
59. The system must track user engagement metrics
60. The system must provide platform-wide analytics for administrators

#### Advanced Moderation
61. The system must implement automated content filtering
62. The system must provide admin tools for content moderation
63. The system must allow for temporary and permanent user bans
64. The system must implement a content review queue for flagged items
65. The system must allow admins to assign moderator roles to users

#### Premium Features (Future)
66. The system must support premium subscriptions for enhanced features
67. The system must allow for sponsored content and featured poems
68. The system must provide advanced publishing tools for premium users

## Non-Goals (Out of Scope)

### MVP Non-Goals
- Payment processing and monetization features
- Advanced analytics and reporting
- Social media integration
- Mobile app development (web-only for MVP)
- Audio/video content support
- Collaborative writing features
- Publishing to external platforms
- Role-based access control system
- Content approval workflow
- Notification system for subscribers
- Ukrainian language support (EN and RU for MVP)

### General Non-Goals
- AI-generated poetry creation
- Real-time chat functionality
- Live streaming or video content
- E-commerce features (book sales, merchandise)
- Integration with external publishing platforms
- Advanced SEO optimization tools

## Design Considerations

For detailed design requirements, specifications, and guidelines, please refer to the [Design Requirements Document](design_prd.md).

### Key Design Principles
- Clean, distraction-free reading experience
- Easy navigation and content discovery
- Intuitive publishing workflow
- Community-focused interface
- Professional yet welcoming aesthetic

## Role-Based Access Control System

### Role Hierarchy
The platform implements a hierarchical role-based access control system with the following roles (from lowest to highest privileges):

0. **Reader** (Unauthenticated)
   - Read access to all published content
   - Browse poems by categories and tags
   - View author profiles
   - Use search functionality
   - Select interface language
   - Submit claim reports (content status not affected)

1. **Subscriber** (Base Authenticated Role)
   - All Reader privileges
   - Leave comments on poems
   - Follow authors and receive notifications
   - Create reading lists
   - Rate and review poems
   - Request author role upgrade
   - Submit claim reports (content status not affected)

2. **Author** (Includes all Subscriber privileges)
   - Submit poems for publication
   - Edit and manage own poems
   - Respond to comments on own poems
   - View analytics for own content
   - Create collections/anthologies
   - Submit claim reports (content status changes to PENDINGREVIEW)

3. **Moderator** (Includes all Author privileges)
   - Approve/reject author role requests
   - Review and approve content before publication
   - Moderate comments and user-generated content
   - Manage content reports and flags
   - Temporary user suspensions
   - Review and handle claim reports
   - Make decisions on content moderation
   - Submit claim reports (content status changes to PENDINGREVIEW)

4. **Admin** (Includes all Moderator privileges)
   - Assign moderator roles to users
   - Manage all user accounts and roles
   - Access platform-wide analytics
   - Permanent user bans
   - System configuration management
   - Comprehensive claim reports management
   - Submit claim reports (content status changes to PENDINGREVIEW)

### Content Approval Workflow
- Users with author role can publish content immediately (approval status = 'approved')
- New users without author role must submit content for moderator review
- Moderators can approve, reject, or request revisions for non-author content
- Approved content is automatically published
- Rejected content is returned to authors with feedback
- Admins can override moderator decisions

### Claim Report Workflow
- Any user can submit a claim report on poems, comments, or reviews
- Multiple claim reports can be submitted for the same resource
- Claim reports from unauthenticated users or SUBSCRIBER role do not affect content status
- Claim reports from AUTHOR, MODERATOR, or ADMIN roles automatically set content status to PENDINGREVIEW
- Moderators and admins review claim reports and make decisions
- Approved claims automatically set content status to REJECTED
- Rejected claims restore original content status

### Notification System
- Subscribers receive notifications about new posts from followed authors
- Authors receive notifications about content approval/rejection (for non-author submissions)
- Moderators receive notifications about new content submissions from non-authors
- Admins receive notifications about system events and escalations

## Category Management System

### Category Creation and Management
The platform implements a comprehensive category management system with the following features:

1. **Category Creation Rights**
   - Only users with moderator role or higher can create and edit categories
   - Categories are created through an admin interface
   - Each category must have translations for all supported interface languages

2. **Multilingual Category Support**
   - Categories must be available in all interface languages (EN, RU, UA)
   - Category names are displayed in the user's selected language
   - Fallback to English if translation is not available
   - Categories are stored in the database with language-specific translations

3. **Category Management Features**
   - Moderators can create, edit, and delete categories
   - Categories can be reordered and organized
   - Categories can be marked as active/inactive
   - Category usage statistics are tracked

### Category Assignment
- Authors can assign their poems to existing categories
- Poems can be assigned to multiple categories
- Category assignment is required for poem publication
- Categories help users discover content through browsing and filtering

## Content Moderation System

### Claim Reports Management
The platform implements a comprehensive claim reports system with the following features:

1. **Claim Report Submission**
   - Claim button available on all poems, comments, and reviews
   - Modal form for submitting claim reports with user messages
   - Support for both authenticated and unauthenticated users
   - Multiple claim reports allowed per resource

2. **Claim Report Processing**
   - Automatic status changes based on reporter role
   - Dashboard interface for moderators and admins
   - Decision tracking with timestamps and handler information
   - Automatic content status updates based on decisions

3. **Dashboard Management**
   - Dedicated page in dashboard for claim reports management
   - Filtering and sorting capabilities
   - Bulk actions for efficient processing
   - Integration with user management system

## Multilingual Support

### Interface Languages
The platform implements comprehensive multilingual support with the following language strategy:

1. **English (EN)** - Default language
   - Primary interface language
   - All system messages and navigation
   - Default fallback for missing translations

2. **Russian (RU)** - MVP language
   - Full interface translation for MVP
   - Complete user experience in Russian
   - Localized content and navigation

3. **Ukrainian (UA)** - Future language (Phase 3)
   - Full interface translation
   - Complete user experience in Ukrainian
   - Localized content and navigation

### User Profile Multilingual Support
- Profile information is optional for each language
- System displays profile information in user's preferred language
- Fallback to English if preferred language is not available

### Language Selection
- Users can select their preferred interface language
- Language preference is stored in user settings
- Interface automatically adapts to selected language
- Language selection persists across sessions

### Content Localization
- Interface elements are fully translated
- System messages and notifications are localized
- Error messages and validation texts are translated
- Date and time formats follow local conventions

## Technical Considerations

For detailed technical requirements, architecture specifications, and implementation guidelines, please refer to the [Technical Requirements Document](tech_prd.md).

## Documentation Requirements

### Language Requirements
- **English Only**: All project documentation, including PRD files, technical specifications, and architecture documents, must be written exclusively in English
- **Code Comments**: All comments in TypeScript/JavaScript files must be written in English
- **User Interface Text**: While the application supports multiple languages (EN, RU, UA) for end users, all development documentation and code comments must be in English
- **Consistency**: Maintain consistent English terminology across all documentation and code comments

### Task Documentation Requirements

- **Detailed Task Descriptions:** Each task defined in the release files under `docs/tasks/` must have a corresponding detailed description document in `docs/tasks_descriptions/release_X.Y/` directory
- **File Naming Convention:** Description files should follow the pattern `release_X.Y_task-number_task-name.md` (e.g., `release_0.1_3.1_configure-prisma-orm.md`)
- **Content Requirements:** Each task description must include:
  - Detailed step-by-step instructions in Russian
  - Code examples with explanations
  - References to relevant documentation (using the exact versions from package.json)
  - Implementation details for FSD architecture compliance
  - Explanations of used technologies (Auth.js, Prisma ORM, TypeScript, React Query, etc.)
  - Alternative implementation approaches with pros and cons
  - Justification for the recommended approach
  - Best practices for solving similar tasks
  - Consideration of dependencies on previous tasks
- **Version Compliance:** All code examples and recommendations must be compatible with the exact library versions specified in package.json.
- **Best Practices:** It is mandatory to follow the best practices and approaches described in the official documentation for each technology, strictly according to the version specified in the corresponding npm package. This is essential to prevent errors and hallucinations.
- **Authentication Standards:** Authentication implementations must follow the latest best practices from the Auth.js documentation (https://authjs.dev/)
- **Purpose:** These detailed descriptions serve as educational materials for developers new to the technologies and architecture patterns used in the project

### Technology Stack Overview
- **Frontend:** Next.js 15.4.4 with App Router, TypeScript
- **Backend:** Next.js API routes with TypeScript
- **Database:** PostgreSQL (Neon) with Prisma ORM v6.13.0
- **Authentication:** Auth.js (next-auth v5 beta)
- **State Management:** React Server Components and Server Actions
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS v4
- **Form Handling:** React Hook Form v7.61.1 with Zod v4.0.10

## CI/CD Requirements

For detailed CI/CD requirements, deployment strategies, and technical implementation, please refer to the [Technical Requirements Document](tech_prd.md).

### Overview
- **Platform:** Vercel for hosting and deployment
- **Branch Strategy:** Main branch for production, feature branches for development
- **Environment Management:** Separate environments for development, staging, and production

## Success Metrics

### MVP Success Metrics
- User registration and retention rates
- Number of poems published per week
- Average time spent reading poems
- Comment engagement rates
- Search functionality usage
- Claim reports processing efficiency
- Content moderation response times

### Advanced Success Metrics
- Rating and review completion rates
- User following and community growth
- Content quality scores
- Moderation effectiveness
- Platform engagement depth
- Claim reports accuracy and resolution times

### Technical Success Metrics
For detailed technical success metrics and performance indicators, please refer to the [Technical Requirements Document](tech_prd.md).

- Page load times under 3 seconds
- 99.9% uptime
- Mobile responsiveness scores
- Accessibility compliance
- Security incident rates

## Open Questions

1. **Content Guidelines:** What specific content guidelines should be established for Christian poetry?
2. **Moderation Scope:** How extensive should the content moderation system be for MVP?
3. **Performance Targets:** What are the expected user volumes and performance requirements?
4. **Data Privacy:** What specific data privacy requirements apply to user content?
5. **Backup Strategy:** What backup and recovery procedures should be implemented?
6. **Testing Strategy:** What level of automated testing is required for MVP vs. advanced features?
7. **Deployment:** What deployment and hosting strategy should be used?
8. **Monitoring:** What specific metrics and alerts should be set up for production monitoring?

## Implementation Phases

### Phase 1: MVP (Weeks 1-8)
- Basic authentication and user management (NextAuth v5, JWT tokens; Email/Password and Google providers)
- Poetry publishing and display
- Simple search and categorization
- Basic community features
- Initial design implementation
- Basic content moderation (claim reports system)
- Multilingual interface (EN, RU)
- Multilingual user profiles
- Basic category management system
- CI/CD pipeline setup and deployment to Vercel
- Detailed task documentation and guidance
- Claim reports dashboard page
- Content moderation workflow

### Phase 2: Enhanced Features (Weeks 9-16)
- Rating and review system
- Advanced search and filtering
- User following and reading lists
- Enhanced user profiles
- Basic analytics
- Role-based access control system
- Content approval workflow
- Advanced category management with multilingual support
- Authentication providers expansion: add Apple and Facebook (in addition to Email/Password and Google); JWT token strategy remains in place
- Automated testing and QA pipeline
- Advanced claim reports management
- Content moderation analytics

### Phase 3: Advanced Features (Weeks 17-24)
- Advanced content moderation system
- Advanced analytics and insights
- Premium feature preparation
- Performance optimization
- Comprehensive testing and refinement
- Notification system for subscribers
- Advanced role management features
- Ukrainian language support
- Advanced claim reports analytics
- Content quality scoring

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Next Review:** [Date + 2 weeks]