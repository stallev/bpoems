# Design Specification: Christian Poetry Platform

## Color Scheme: Modern Spiritual

### Primary Colors
- **Primary Background (Light)**: `#FAFAFA` - clean white
- **Primary Background (Dark)**: `#121212` - deep black
- **Primary Text (Light)**: `#1A202C` - almost black
- **Primary Text (Dark)**: `#F7FAFC` - almost white
- **Text Main**: `#1A202C` - main content text color
- **Text Secondary**: `#4A5568` - secondary text, descriptions
- **Text Light Gray**: `#A0AEC0` - placeholders, disabled text
- **Dark Gray**: `#2D3748` - headings, emphasized text
- **Fill Main**: `#2D3748` - icons, visual elements
- **Accent 1 (Primary)**: `#805AD5` - purple (symbolizes spirituality)
- **Accent 2 (Secondary)**: `#3182CE` - blue (symbolizes faith, heaven)
- **Accent 3 (Accent)**: `#38A169` - green (symbolizes growth, hope)

### Semantic Colors
- **Success**: `#38A169` - green
- **Warning**: `#DD6B20` - orange
- **Error**: `#E53E3E` - red
- **Info**: `#3182CE` - blue

### Color Shades
Each primary color has a range of shades from 50 to 950:

#### Primary (Purple)
- 50: `#F5F3FF`
- 100: `#EDE9FE`
- 200: `#DDD6FE`
- 300: `#C4B5FD`
- 400: `#A78BFA`
- 500: `#8B5CF6`
- 600: `#7C3AED`
- 700: `#6D28D9`
- 800: `#5B21B6`
- 900: `#4C1D95`
- 950: `#2E1065`

#### Secondary (Blue)
- 50: `#EFF6FF`
- 100: `#DBEAFE`
- 200: `#BFDBFE`
- 300: `#93C5FD`
- 400: `#60A5FA`
- 500: `#3B82F6`
- 600: `#2563EB`
- 700: `#1D4ED8`
- 800: `#1E40AF`
- 900: `#1E3A8A`
- 950: `#172554`

#### Accent (Green)
- 50: `#F0FDF4`
- 100: `#DCFCE7`
- 200: `#BBF7D0`
- 300: `#86EFAC`
- 400: `#4ADE80`
- 500: `#22C55E`
- 600: `#16A34A`
- 700: `#15803D`
- 800: `#166534`
- 900: `#14532D`
- 950: `#052E16`

## Typography

### Fonts
- **Primary Font (UI)**: Inter - clean, modern sans-serif font
- **Poetry Font**: Merriweather - elegant serif font

### Font Sizes
- **Heading 1**: 2.5rem (40px)
- **Heading 2**: 2rem (32px)
- **Heading 3**: 1.5rem (24px)
- **Heading 4**: 1.25rem (20px)
- **Body Text**: 1rem (16px)
- **Small Text**: 0.875rem (14px)
- **Extra Small Text**: 0.75rem (12px)

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Line Heights
- **Headings**: 1.2
- **Body Text**: 1.5
- **Poetry**: 1.8

## Components

### Buttons
- **Primary**: purple background, white text
- **Secondary**: blue background, white text
- **Outline**: transparent background, colored border
- **Ghost**: transparent background, no border
- **Destructive**: red background, white text

#### Button States
- **Default**: base color
- **Hover**: slightly darker
- **Active**: even darker
- **Focus**: with focus ring
- **Disabled**: muted color with reduced opacity

### Cards
- **Standard**: white background, thin border, slight border radius
- **Elevated**: white background, shadow, border radius
- **Contrast**: colored background, white text

### Forms
- **Input Fields**: light gray background, dark text, thin border
- **Labels**: small text, medium weight
- **Error Messages**: red text below input field
- **Hints**: gray text below input field

### Navigation
- **Main Navigation**: white background, dark text
- **Active Item**: purple text, indicator
- **Sidebar Navigation**: light gray background, dark text
- **Bottom Navigation**: white background, icons with labels

## Layouts and Grid

### Containers
- **Maximum Content Width**: 1200px
- **Maximum Text Width**: 800px (for optimal readability)

### Spacing
- **Base Spacing**: 0.25rem (4px)
- **Small Spacing**: 0.5rem (8px)
- **Medium Spacing**: 1rem (16px)
- **Large Spacing**: 1.5rem (24px)
- **Extra Large Spacing**: 2rem (32px)

### Border Radius
- **Small**: 0.25rem (4px)
- **Medium**: 0.5rem (8px)
- **Large**: 1rem (16px)
- **Full**: 9999px (for round elements)

### Shadows
- **Small**: 0 1px 3px rgba(0, 0, 0, 0.1)
- **Medium**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **Large**: 0 10px 15px rgba(0, 0, 0, 0.1)

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

### Responsive Layouts
- **Mobile**: single column layout, simplified navigation
- **Tablet**: two-column layout, sidebar
- **Desktop**: multi-column layout, full navigation

## Animations and Transitions

### Durations
- **Fast**: 150ms
- **Standard**: 300ms
- **Slow**: 500ms

### Easing Curves
- **Standard**: ease-in-out
- **Entry**: ease-out
- **Exit**: ease-in
- **Sharp**: cubic-bezier(0.4, 0, 0.2, 1)

## Accessibility

### Contrast
- All text elements must meet WCAG 2.1 AA minimum contrast requirements (4.5:1 for normal text, 3:1 for large text)

### Focus
- All interactive elements must have visible focus indicators
- Focus indicator: purple ring (2px)

### Alternative Text
- All images must have informative alternative text

## Themes

### Light Theme (Default)
- White background
- Dark text
- Colored accents

### Dark Theme
- Dark background
- Light text
- Brighter accents

## Component Usage Guidelines

### General Rules
- Use semantic Tailwind classes instead of direct colors
- Follow atomic CSS principles
- Maintain consistency across all components

### Custom Component Styling
- Use CSS variables for colors and other properties
- Apply Tailwind classes for styling
- Avoid inline styles with hardcoded values
- Follow the "Design Tokens" principle

## Usage Examples

### Button
```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary-600">
  Button
</button>
```

### Card
```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg p-4 shadow">
  Card content
</div>
```

### Text Input
```tsx
<input className="bg-background text-foreground border border-input rounded-md p-2" />
```