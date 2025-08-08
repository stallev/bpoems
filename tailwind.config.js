/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        /* ========== SHADCN/UI SYSTEM COLORS ========== */
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--color-popover)',
          foreground: 'var(--color-popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },
        chart: {
          1: 'var(--color-chart-1)',
          2: 'var(--color-chart-2)',
          3: 'var(--color-chart-3)',
          4: 'var(--color-chart-4)',
          5: 'var(--color-chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--color-sidebar)',
          foreground: 'var(--color-sidebar-foreground)',
          primary: 'var(--color-sidebar-primary)',
          'primary-foreground': 'var(--color-sidebar-primary-foreground)',
          accent: 'var(--color-sidebar-accent)',
          'accent-foreground': 'var(--color-sidebar-accent-foreground)',
          border: 'var(--color-sidebar-border)',
          ring: 'var(--color-sidebar-ring)',
        },

        /* ========== CUSTOM SEMANTIC COLORS ========== */
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',

        /* ========== CUSTOM TEXT COLORS ========== */
        'text-main': 'var(--color-text-main)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-light-gray': 'var(--color-text-light-gray)',
        'dark-gray': 'var(--color-dark-gray)',
        'fill-main': 'var(--color-fill-main)',

        /* ========== OCEAN SERENITY THEME COLORS ========== */
        // Deep Ocean Blue (Primary) - символ глубины веры и постоянства
        'ocean-deep': {
          DEFAULT: 'var(--color-ocean-deep)',
          foreground: 'var(--color-ocean-deep-foreground)',
          50: 'var(--color-ocean-deep-50)',
          100: 'var(--color-ocean-deep-100)',
          200: 'var(--color-ocean-deep-200)',
          300: 'var(--color-ocean-deep-300)',
          400: 'var(--color-ocean-deep-400)',
          500: 'var(--color-ocean-deep-500)',
          600: 'var(--color-ocean-deep-600)',
          700: 'var(--color-ocean-deep-700)',
          800: 'var(--color-ocean-deep-800)',
          900: 'var(--color-ocean-deep-900)',
          950: 'var(--color-ocean-deep-950)',
        },

        // Ocean Cyan (Secondary) - символ ясности, чистоты и освежения
        'ocean-cyan': {
          DEFAULT: 'var(--color-ocean-cyan)',
          foreground: 'var(--color-ocean-cyan-foreground)',
          50: 'var(--color-ocean-cyan-50)',
          100: 'var(--color-ocean-cyan-100)',
          200: 'var(--color-ocean-cyan-200)',
          300: 'var(--color-ocean-cyan-300)',
          400: 'var(--color-ocean-cyan-400)',
          500: 'var(--color-ocean-cyan-500)',
          600: 'var(--color-ocean-cyan-600)',
          700: 'var(--color-ocean-cyan-700)',
          800: 'var(--color-ocean-cyan-800)',
          900: 'var(--color-ocean-cyan-900)',
          950: 'var(--color-ocean-cyan-950)',
        },

        // Ocean Emerald (Accent) - символ исцеления, мира и процветания
        'ocean-emerald': {
          DEFAULT: 'var(--color-ocean-emerald)',
          foreground: 'var(--color-ocean-emerald-foreground)',
          50: 'var(--color-ocean-emerald-50)',
          100: 'var(--color-ocean-emerald-100)',
          200: 'var(--color-ocean-emerald-200)',
          300: 'var(--color-ocean-emerald-300)',
          400: 'var(--color-ocean-emerald-400)',
          500: 'var(--color-ocean-emerald-500)',
          600: 'var(--color-ocean-emerald-600)',
          700: 'var(--color-ocean-emerald-700)',
          800: 'var(--color-ocean-emerald-800)',
          900: 'var(--color-ocean-emerald-900)',
          950: 'var(--color-ocean-emerald-950)',
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        poetry: ['var(--font-poetry)', 'serif'],
      },
      fontSize: {
        // Custom font sizes from design spec
        'heading-1': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-2': ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-3': ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-4': ['1.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.5' }],
        small: ['0.875rem', { lineHeight: '1.4' }],
        xs: ['0.75rem', { lineHeight: '1.3' }],
        poetry: ['1.125rem', { lineHeight: '1.8' }],
      },
      spacing: {
        // Custom spacing scale
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
      },
      boxShadow: {
        'custom-sm': 'var(--shadow-sm)',
        'custom-md': 'var(--shadow-md)',
        'custom-lg': 'var(--shadow-lg)',
      },
      transitionDuration: {
        fast: '150ms',
        standard: '300ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      maxWidth: {
        content: '1200px',
        text: '800px',
      },
      screens: {
        xs: '400px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwindcss-animate'),
    // Custom plugin for content width utilities
    function ({ addUtilities }) {
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
      };
      addUtilities(newUtilities);
    },
  ],
};
