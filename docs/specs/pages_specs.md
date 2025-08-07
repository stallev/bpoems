# Page Specifications - Christian Poetry Platform

## Overview

This document outlines the detailed specifications for all main pages of the Christian Poetry Platform, following Feature-Sliced Design (FSD) architecture principles. Each page is composed of widgets and features from the FSD layers.

## Page Structure

All pages follow the FSD composition pattern:
- **Pages Layer**: Page components that compose widgets and features
- **Widgets Layer**: Complex UI blocks that combine multiple features
- **Features Layer**: User-facing functionality and business logic
- **Entities Layer**: Business entities and their related logic
- **Shared Layer**: Common utilities and components

## Main Pages

### 1. Homepage (`src/pages/home/`)

#### Purpose
Main landing page showcasing featured content and providing navigation to key sections.

#### Content Structure
```
Homepage
├── Header Widget
│   ├── Logo and navigation
│   ├── Search bar
│   ├── Language switcher
│   └── User authentication status
├── Hero Section
│   ├── Welcome message
│   ├── Call-to-action buttons
│   └── Featured poem preview
├── Featured Content Section
│   ├── Featured poems widget
│   ├── Recent poems widget
│   └── Popular categories widget
├── Community Section
│   ├── Active authors widget
│   ├── Recent comments widget
│   └── Community statistics
└── Footer Widget
    ├── Site links
    ├── Social media links
    └── Legal information
```

#### FSD Composition
- **Widgets**: Header, Footer, FeaturedContent, CommunityHighlights
- **Features**: Search, ContentDiscovery
- **Entities**: Poem, User, Category
- **Shared**: UI components, utilities

#### Responsive Behavior
- **Desktop**: Full layout with sidebar navigation
- **Tablet**: Condensed layout with collapsible navigation
- **Mobile**: Stacked layout with hamburger menu

---

### 2. Authentication Pages (`src/pages/auth/`)

#### 2.1 Login Page (`src/pages/auth/login/`)

##### Purpose
User authentication and login functionality.

##### Content Structure
```
Login Page
├── Header Widget (minimal)
├── Login Form Widget
│   ├── Email/username input
│   ├── Password input
│   ├── Remember me checkbox
│   ├── Login button
│   ├── Forgot password link
│   └── Registration link
├── Social Login Section
│   ├── Google login button
│   ├── GitHub login button
│   └── Other providers
└── Footer Widget (minimal)
```

##### FSD Composition
- **Widgets**: Header, Footer, LoginForm
- **Features**: Auth
- **Entities**: User
- **Shared**: Form components, validation utilities

#### 2.2 Registration Page (`src/pages/auth/register/`)

##### Purpose
New user registration and account creation.

##### Content Structure
```
Registration Page
├── Header Widget (minimal)
├── Registration Form Widget
│   ├── Username input
│   ├── Email input
│   ├── Password input
│   ├── Confirm password input
│   ├── Terms and conditions checkbox
│   ├── Registration button
│   └── Login link
├── Role Selection Section
│   ├── Subscriber role option
│   ├── Author role request option
│   └── Role description
└── Footer Widget (minimal)
```

##### FSD Composition
- **Widgets**: Header, Footer, RegistrationForm, RoleSelection
- **Features**: Auth, UserManagement
- **Entities**: User, Role
- **Shared**: Form components, validation utilities

---

### 3. Poem Pages (`src/pages/poems/`)

#### 3.1 Poem List Page (`src/pages/poems/list/`)

##### Purpose
Display paginated list of poems with filtering and sorting options.

##### Content Structure
```
Poem List Page
├── Header Widget
├── Filter Panel Widget
│   ├── Category filter
│   ├── Tag filter
│   ├── Author filter
│   ├── Date range filter
│   └── Sort options
├── Search Results Widget
│   ├── Poem cards grid
│   ├── Pagination controls
│   ├── Results count
│   └── No results message
├── Sidebar Widget
│   ├── Popular categories
│   ├── Trending tags
│   └── Recent authors
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, FilterPanel, SearchResults, Sidebar
- **Features**: Search, ContentDiscovery, Filtering
- **Entities**: Poem, Category, Tag, User
- **Shared**: UI components, pagination utilities

#### 3.2 Poem Detail Page (`src/pages/poems/[id]/`)

##### Purpose
Display individual poem with full content and metadata.

##### Content Structure
```
Poem Detail Page
├── Header Widget
├── Poem Content Widget
│   ├── Poem title
│   ├── Author information
│   ├── Poem content (rich text)
│   ├── Publication date
│   ├── Categories and tags
│   └── Reading time estimate
├── Poem Actions Widget
│   ├── Like/favorite button
│   ├── Share button
│   ├── Report button
│   └── Edit button (for author)
├── Author Profile Widget
│   ├── Author avatar
│   ├── Author bio
│   ├── Author statistics
│   └── Follow button
├── Comments Section Widget
│   ├── Comment form
│   ├── Comments list
│   ├── Comment pagination
│   └── Comment moderation tools
├── Related Poems Widget
│   ├── Similar poems
│   ├── Author's other poems
│   └── Category recommendations
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, PoemContent, PoemActions, AuthorProfile, CommentsSection, RelatedPoems
- **Features**: PoemViewing, Comments, UserProfile
- **Entities**: Poem, User, Comment, Category, Tag
- **Shared**: UI components, sharing utilities

#### 3.3 Poem Creation Page (`src/pages/poems/create/`)

##### Purpose
Allow authors to create and publish new poems.

##### Content Structure
```
Poem Creation Page
├── Header Widget
├── Poem Editor Widget
│   ├── Title input
│   ├── WYSIWYG content editor
│   ├── Category selection
│   ├── Tag input
│   ├── Description field
│   └── Preview button
├── Publishing Options Widget
│   ├── Draft save option
│   ├── Publish immediately option
│   ├── Schedule publication option
│   └── Visibility settings
├── Editor Toolbar Widget
│   ├── Formatting tools
│   ├── Undo/redo buttons
│   ├── Auto-save indicator
│   └── Word count
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, PoemEditor, PublishingOptions, EditorToolbar
- **Features**: PoemCreation, ContentManagement
- **Entities**: Poem, Category, Tag
- **Shared**: WYSIWYG editor, form components

---

### 4. User Profile Pages (`src/pages/profile/`)

#### 4.1 User Profile Page (`src/pages/profile/[username]/`)

##### Purpose
Display user profile with their poems and activity.

##### Content Structure
```
User Profile Page
├── Header Widget
├── Profile Header Widget
│   ├── User avatar
│   ├── Username and display name
│   ├── User bio (WYSIWYG content)
│   ├── Join date
│   ├── User statistics
│   └── Follow/unfollow button
├── Profile Navigation Widget
│   ├── Poems tab
│   ├── About tab
│   ├── Activity tab
│   └── Settings tab (for own profile)
├── User Poems Widget
│   ├── Poems grid/list
│   ├── Filtering options
│   ├── Sorting options
│   └── Pagination
├── User Activity Widget
│   ├── Recent comments
│   ├── Recent likes
│   ├── Recent follows
│   └── Activity timeline
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, ProfileHeader, ProfileNavigation, UserPoems, UserActivity
- **Features**: UserProfile, ContentDiscovery
- **Entities**: User, Poem, Comment
- **Shared**: UI components, activity utilities

#### 4.2 Profile Settings Page (`src/pages/profile/settings/`)

##### Purpose
Allow users to edit their profile information and preferences.

##### Content Structure
```
Profile Settings Page
├── Header Widget
├── Settings Navigation Widget
│   ├── Profile settings tab
│   ├── Account settings tab
│   ├── Privacy settings tab
│   └── Notification settings tab
├── Profile Settings Widget
│   ├── Avatar upload
│   ├── Display name input
│   ├── Bio editor (WYSIWYG)
│   ├── Location input
│   └── Website input
├── Account Settings Widget
│   ├── Email change
│   ├── Password change
│   ├── Role request section
│   └── Account deletion
├── Privacy Settings Widget
│   ├── Profile visibility
│   ├── Activity visibility
│   ├── Comment visibility
│   └── Data sharing preferences
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, SettingsNavigation, ProfileSettings, AccountSettings, PrivacySettings
- **Features**: UserProfile, UserManagement, Privacy
- **Entities**: User, Role
- **Shared**: Form components, file upload utilities

---

### 5. Category and Tag Pages (`src/pages/categories/`, `src/pages/tags/`)

#### 5.1 Category Page (`src/pages/categories/[slug]/`)

##### Purpose
Display poems filtered by specific category.

##### Content Structure
```
Category Page
├── Header Widget
├── Category Header Widget
│   ├── Category name (multilingual)
│   ├── Category description
│   ├── Category statistics
│   └── Category image/icon
├── Category Poems Widget
│   ├── Poems grid/list
│   ├── Sorting options
│   ├── Date filtering
│   └── Pagination
├── Category Sidebar Widget
│   ├── Related categories
│   ├── Popular tags in category
│   ├── Top authors in category
│   └── Category activity
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, CategoryHeader, CategoryPoems, CategorySidebar
- **Features**: ContentDiscovery, Filtering
- **Entities**: Category, Poem, User, Tag
- **Shared**: UI components, filtering utilities

#### 5.2 Tag Page (`src/pages/tags/[slug]/`)

##### Purpose
Display poems tagged with specific tag.

##### Content Structure
```
Tag Page
├── Header Widget
├── Tag Header Widget
│   ├── Tag name
│   ├── Tag description
│   ├── Tag statistics
│   └── Tag usage graph
├── Tagged Poems Widget
│   ├── Poems grid/list
│   ├── Sorting options
│   ├── Date filtering
│   └── Pagination
├── Tag Sidebar Widget
│   ├── Related tags
│   ├── Popular categories for tag
│   ├── Top authors using tag
│   └── Tag trends
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, TagHeader, TaggedPoems, TagSidebar
- **Features**: ContentDiscovery, Filtering
- **Entities**: Tag, Poem, User, Category
- **Shared**: UI components, filtering utilities

---

### 6. Search Results Page (`src/pages/search/`)

##### Purpose
Display search results with advanced filtering options.

##### Content Structure
```
Search Results Page
├── Header Widget
├── Search Header Widget
│   ├── Search query display
│   ├── Results count
│   ├── Search time
│   └── Search suggestions
├── Advanced Filters Widget
│   ├── Content type filter
│   ├── Date range filter
│   ├── Author filter
│   ├── Category filter
│   ├── Tag filter
│   └── Rating filter
├── Search Results Widget
│   ├── Results list/grid
│   ├── Result highlighting
│   ├── Relevance indicators
│   ├── Sorting options
│   └── Pagination
├── Search Sidebar Widget
│   ├── Search history
│   ├── Popular searches
│   ├── Search tips
│   └── Related searches
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, SearchHeader, AdvancedFilters, SearchResults, SearchSidebar
- **Features**: Search, Filtering, ContentDiscovery
- **Entities**: Poem, User, Category, Tag
- **Shared**: UI components, search utilities

---

### 7. Admin Pages (`src/pages/admin/`)

#### 7.1 Category Management Page (`src/pages/admin/categories/`)

##### Purpose
Allow moderators and admins to manage poem categories.

##### Content Structure
```
Category Management Page
├── Header Widget
├── Admin Navigation Widget
│   ├── Categories tab
│   ├── Users tab
│   ├── Reports tab
│   └── Settings tab
├── Category List Widget
│   ├── Categories table
│   ├── Category actions
│   ├── Category statistics
│   └── Bulk actions
├── Category Editor Widget
│   ├── Category creation form
│   ├── Category editing form
│   ├── Multilingual inputs
│   └── Category validation
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, AdminNavigation, CategoryList, CategoryEditor
- **Features**: CategoryManagement, AdminPanel
- **Entities**: Category
- **Shared**: UI components, admin utilities

#### 7.2 User Management Page (`src/pages/admin/users/`)

##### Purpose
Allow admins to manage users and roles.

##### Content Structure
```
User Management Page
├── Header Widget
├── Admin Navigation Widget
├── User List Widget
│   ├── Users table
│   ├── User actions
│   ├── User statistics
│   └── Bulk actions
├── Role Management Widget
│   ├── Role assignment
│   ├── Role requests
│   ├── Role permissions
│   └── Role audit log
└── Footer Widget
```

##### FSD Composition
- **Widgets**: Header, Footer, AdminNavigation, UserList, RoleManagement
- **Features**: UserManagement, AdminPanel, RBAC
- **Entities**: User, Role
- **Shared**: UI components, admin utilities

---

## Page Requirements

### Accessibility Requirements
- **WCAG 2.1 AA Compliance**: All pages must meet accessibility standards
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Focus Management**: Clear focus indicators

### Performance Requirements
- **Page Load Time**: Under 3 seconds for initial load
- **Core Web Vitals**: Meet Google's performance standards
- **Lazy Loading**: Implement for images and non-critical content
- **Code Splitting**: Use dynamic imports for page components
- **Caching**: Implement appropriate caching strategies

### SEO Requirements
- **Meta Tags**: Proper title, description, and Open Graph tags
- **Structured Data**: Implement JSON-LD for relevant pages
- **Sitemap**: Include all pages in sitemap.xml
- **Canonical URLs**: Prevent duplicate content issues
- **Hreflang**: Support for multilingual pages

### Mobile Responsiveness
- **Mobile-First Design**: Optimize for mobile devices first
- **Touch Targets**: Minimum 44px for interactive elements
- **Viewport Optimization**: Proper viewport meta tags
- **Performance**: Optimize for mobile networks
- **Usability**: Ensure good UX on all screen sizes

## FSD Implementation Notes

### Page Composition Rules
1. **Pages can only import from widgets, features, entities, and shared layers**
2. **Pages should not contain business logic**
3. **Pages focus on composition and routing**
4. **Pages handle data fetching coordination**
5. **Pages manage layout and responsive behavior**

### Widget Integration
- Each page composes multiple widgets
- Widgets handle complex UI interactions
- Widgets can combine multiple features
- Widgets provide reusable UI blocks

### Feature Integration
- Features provide business logic and user interactions
- Features handle state management
- Features integrate with API endpoints
- Features export public APIs for widgets

### Entity Integration
- Entities provide data models and business logic
- Entities handle data validation and transformation
- Entities manage relationships between data
- Entities export UI components for display

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Next Review:** [Date + 2 weeks]
