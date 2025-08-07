/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
          50: "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
          950: "var(--color-primary-950)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
          50: "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
          950: "var(--color-secondary-950)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        // Custom semantic colors
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        // Custom text colors
        "text-main": "var(--color-text-main)",
        "text-secondary": "var(--color-text-secondary)",
        "text-light-gray": "var(--color-text-light-gray)",
        "dark-gray": "var(--color-dark-gray)",
        "fill-main": "var(--color-fill-main)",
        // Accent green colors
        "accent-green": {
          DEFAULT: "var(--color-accent-green)",
          foreground: "var(--color-accent-green-foreground)",
          50: "var(--color-accent-green-50)",
          100: "var(--color-accent-green-100)",
          200: "var(--color-accent-green-200)",
          300: "var(--color-accent-green-300)",
          400: "var(--color-accent-green-400)",
          500: "var(--color-accent-green-500)",
          600: "var(--color-accent-green-600)",
          700: "var(--color-accent-green-700)",
          800: "var(--color-accent-green-800)",
          900: "var(--color-accent-green-900)",
          950: "var(--color-accent-green-950)",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        poetry: ["var(--font-serif)", "serif"],
      },
      fontSize: {
        // Custom font sizes from design spec
        "heading-1": ["2.5rem", { lineHeight: "1.2", fontWeight: "600" }],
        "heading-2": ["2rem", { lineHeight: "1.2", fontWeight: "600" }],
        "heading-3": ["1.5rem", { lineHeight: "1.2", fontWeight: "600" }],
        "heading-4": ["1.25rem", { lineHeight: "1.2", fontWeight: "600" }],
        "body": ["1rem", { lineHeight: "1.5" }],
        "small": ["0.875rem", { lineHeight: "1.4" }],
        "xs": ["0.75rem", { lineHeight: "1.3" }],
        "poetry": ["1.125rem", { lineHeight: "1.8" }],
      },
      spacing: {
        // Custom spacing scale
        "xs": "var(--spacing-xs)",
        "sm": "var(--spacing-sm)",
        "md": "var(--spacing-md)",
        "lg": "var(--spacing-lg)",
        "xl": "var(--spacing-xl)",
      },
      boxShadow: {
        "custom-sm": "var(--shadow-sm)",
        "custom-md": "var(--shadow-md)",
        "custom-lg": "var(--shadow-lg)",
      },
      transitionDuration: {
        "fast": "150ms",
        "standard": "300ms",
        "slow": "500ms",
      },
      transitionTimingFunction: {
        "sharp": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      maxWidth: {
        "content": "1200px",
        "text": "800px",
      },
      screens: {
        "xs": "400px",
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for content width utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.content-width': {
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        },
        '.text-width': {
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
        '.poetry-spacing': {
          lineHeight: '1.8',
          fontSize: '1.125rem',
          fontFamily: 'var(--font-serif)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
