# Header Widget Design Specification

## Overview

The `Header Widget` is a critical UI component that serves as the primary navigation and branding element across all pages of the Christian Poetry Platform. It provides access to main site sections, user authentication status, and responsive navigation options.

## Design Requirements

### General Requirements
- **Consistency with Site Theme**: The Header Widget must adhere to the site's color scheme, typography, and overall aesthetic as defined in the `design_spec.md`. This includes using primary colors (e.g., `#805AD5` for accents), semantic Tailwind classes, and CSS variables for styling.
- **Responsive Design**: The Header must be fully responsive, adapting to different screen sizes as per the defined breakpoints (Mobile < 768px, Tablet 768px - 1024px, Desktop > 1024px).
- **Accessibility**: Must comply with WCAG 2.1 AA standards, ensuring proper contrast ratios, keyboard navigation, and screen reader support with ARIA labels for interactive elements.
- **Performance**: Optimized for performance with minimal render-blocking resources and efficient use of CSS and JavaScript.
- **Modularity**: Designed as a self-contained component following Feature-Sliced Design principles, allowing reuse across different pages.

### Specific Design Requirements

#### Layout and Structure
- **Logo Placement**: The site logo must be positioned on the left side of the Header, serving as a clickable link to the homepage (`RoutePath.HOME`). The logo should use the primary accent color (`#805AD5`) or a suitable variation for visibility against the Header background.
- **Background**: The Header background should be set to the primary background color (`#FAFAFA` for light theme, `#121212` for dark theme) to ensure consistency with the site's overall design.
- **Height**: Fixed height of 64px on desktop and tablet views to maintain a consistent touch target area, expanding dynamically on mobile when the menu is open.

#### Navigation Menu (Desktop)
- **Visibility**: On screens wider than 768px, the main navigation menu must be visible by default, positioned to the right of the logo.
- **Menu Items**: Menu items should include links to key public pages such as `RoutePath.HOME`, `RoutePath.ABOUT`, and `RoutePath.POEMS_LIST`. Text color for menu items should be the primary text color (`#1A202C` for light theme, `#F7FAFC` for dark theme), with hover states using a darker shade of the primary accent color (`#6D28D9`).
- **Spacing**: Horizontal spacing between menu items should be `1.5rem (24px)` to ensure readability and touch target accessibility.

#### Navigation Menu (Mobile)
- **Visibility**: On screens narrower than 768px, the main navigation menu must be hidden by default. A hamburger icon (using the primary accent color `#805AD5`) on the right side of the Header serves as the toggle button.
- **Animation**: Upon clicking the hamburger icon, the menu should slide in from the right with a smooth transition (duration: 300ms, easing: ease-in-out). The menu should overlay the content with a semi-transparent background (`rgba(0, 0, 0, 0.5)`) to focus user attention.
- **Menu Layout**: The mobile menu should be a vertical list with full-width items, using the same color scheme as desktop menu items. Each item should have a padding of `1rem (16px)` for touch accessibility.

#### Authentication Status
- **Unauthenticated State**: If the user is not logged in, the main navigation menu (both desktop and mobile) must include links to `RoutePath.LOGIN` and `RoutePath.REGISTER`. These links should be styled as buttons with the primary accent color (`#805AD5`) for `LOGIN` and an outline style with the secondary accent color (`#3182CE`) for `REGISTER`.
- **Authenticated State**: If the user is logged in, the links to `LOGIN` and `REGISTER` must be removed. Instead, an avatar icon (circular, 40x40px, using the user's profile image or a default icon with primary accent color `#805AD5`) must be displayed on the right side of the Header.

#### Dropdown Profile User Menu (Authenticated State)
- **Trigger**: Clicking the avatar icon triggers a dropdown menu. The dropdown should appear below the avatar with a slight offset (8px) and a subtle shadow (`0 4px 6px rgba(0, 0, 0, 0.1)`).
- **Background and Border**: The dropdown background should match the Header background (`#FAFAFA` or `#121212`), with a thin border (`1px solid #E2E8F0` for light theme, `1px solid #2D3748` for dark theme).
- **Menu Items**: The dropdown menu should include the following links:
  - **Profile**: Links to `RoutePath.PROFILE` with the user's username.
  - **Settings**: Links to `RoutePath.PROFILE_SETTINGS` for account and privacy settings.
  - **My Poems**: Links to a filtered view of `RoutePath.POEMS_LIST` showing only the user's poems (requires author role).
  - **Dashboard**: Links to `RoutePath.DASHBOARD` (visible only for admin role).
  - **Logout**: Triggers a logout action, redirecting to `RoutePath.HOME`.
- **Styling**: Menu items should have a padding of `0.5rem (8px)` vertically and `1rem (16px)` horizontally, with a hover background of a lighter shade of the primary color (`#EDE9FE` for light theme, `#2E1065` for dark theme).

#### Responsive Behavior
- **Desktop (>768px)**: Full Header with visible navigation menu and authentication controls on the right.
- **Mobile (<=768px)**: Condensed Header with hamburger icon for navigation. When the menu is open, it should take up to 80% of the screen width from the right side.

## Interaction Design
- **Hover States**: Navigation links and buttons should darken on hover (e.g., from `#805AD5` to `#6D28D9`) with a fast transition (150ms).
- **Focus States**: All interactive elements must have a visible focus ring using the primary accent color (`#805AD5`, 2px width).
- **Active States**: Clicking a menu item or button should show a pressed state with a slightly darker shade.
- **Accessibility**: ARIA attributes must be used for the hamburger menu (`aria-expanded`, `aria-controls`) and dropdown menu (`aria-haspopup`, `aria-expanded`).

## Usage Example

```tsx
export function Header() {
  return (
    <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <a href={RoutePath.HOME.path} className="text-primary mr-6">
          {/* Logo */}
          <span className="text-xl font-bold">Christian Poetry</span>
        </a>
        <nav className="hidden md:flex space-x-6">
          <a href={RoutePath.HOME.path} className="text-foreground hover:text-primary">Home</a>
          <a href={RoutePath.ABOUT.path} className="text-foreground hover:text-primary">About</a>
          <a href={RoutePath.POEMS_LIST.path} className="text-foreground hover:text-primary">Poems</a>
        </nav>
      </div>
      <div className="flex items-center">
        {/* Conditional rendering based on auth state */}
        {isAuthenticated ? (
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white" aria-haspopup="true">
              {/* Avatar or Initials */}
              <span>U</span>
            </button>
            {/* Dropdown Menu */}
            {/* Implementation of dropdown with profile links */}
          </div>
        ) : (
          <div className="flex space-x-4">
            <a href={RoutePath.LOGIN.path} className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary-600">Login</a>
            <a href={RoutePath.REGISTER.path} className="border border-secondary text-secondary px-4 py-2 rounded-md hover:bg-secondary-50">Register</a>
          </div>
        )}
        <button className="md:hidden text-primary" aria-label="Toggle navigation">
          {/* Hamburger Icon */}
        </button>
      </div>
    </header>
  );
}
```

---

**Document Version:** 1.0  
**Last Updated:** 8/15/2025  
**Next Review:** [Date + 2 weeks]
