/**
 * Tailwind theme — values mirror css/tokens.css (keep in sync).
 * Colors stay as hex so opacity modifiers (bg-leaf-600/80) work with CDN.
 * Spacing / radius / shadow reference CSS vars where safe.
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        soap: {
          50:  '#f7fcf8',
          100: '#eef8f0',
          200: '#d8f0de',
          300: '#b5e2c2',
        },
        leaf: {
          50:  '#f0faf3',
          100: '#e0f4e6',
          200: '#d8f0de',
          300: '#b5e2c2',
          400: '#5ec07a',
          500: '#3aab5c',
          600: '#2d8f4b',
          700: '#247240',
          800: '#1f5c36',
          900: '#1a4a2d',
        },
        ink: {
          50:  '#f7f8f8',
          100: '#eef0f1',
          200: '#d9dde0',
          300: '#b4bcc2',
          400: '#87939c',
          500: '#66747f',
          600: '#4f5c66',
          700: '#414b53',
          800: '#383f45',
          900: '#1f252a',
          950: '#12161a',
        },
        page: '#fafbfb',
        sky: {
          100: '#e0f2fe',
          200: '#bae6fd',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        amber: {
          100: '#fef3c7',
          200: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        violet: {
          100: '#ede9fe',
          200: '#ddd6fe',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        rose: {
          100: '#ffe4e6',
          200: '#fecdd3',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'Nunito', 'system-ui', 'sans-serif'],
        display: ['Quicksand', 'Nunito', 'system-ui', 'sans-serif'],
        accent: ['Quicksand', 'Nunito', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs:   ['0.75rem',   { lineHeight: '1.4' }],   /* 12 */
        sm:   ['0.8125rem', { lineHeight: '1.4' }],   /* 13 */
        base: ['0.9375rem', { lineHeight: '1.5' }],   /* 15 */
        md:   ['0.875rem',  { lineHeight: '1.45' }],  /* 14 */
        lg:   ['1rem',      { lineHeight: '1.25' }],  /* 16 */
        xl:   ['1.0625rem', { lineHeight: '1.3' }],   /* 17 */
        '2xl':['1.25rem',   { lineHeight: '1.2' }],   /* 20 */
        '3xl':['1.5rem',    { lineHeight: '1.15' }],  /* 24 */
        '4xl':['2rem',      { lineHeight: '1.1' }],   /* 32 */
        '5xl':['2.5rem',    { lineHeight: '1.08' }],  /* 40 */
        '6xl':['3rem',      { lineHeight: '1.05' }],  /* 48 */
      },
      spacing: {
        '18': '4.5rem', /* 72px — header / hero offset */
      },
      borderRadius: {
        sm:   '0.5rem',
        md:   '0.75rem',
        lg:   '1rem',
        xl:   '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(31, 92, 54, 0.10)',
        card: '0 2px 12px -2px rgba(18, 22, 26, 0.06), 0 8px 28px -8px rgba(18, 22, 26, 0.08)',
        lift: '0 16px 40px -12px rgba(18, 22, 26, 0.14)',
        nav:  '0 4px 24px -4px rgba(31, 92, 54, 0.12)',
        icon: '0 8px 18px -6px rgba(45, 143, 75, 0.35)',
        glow: '0 14px 28px -10px rgba(45, 143, 75, 0.50)',
        cta:  '0 12px 24px -10px rgba(45, 143, 75, 0.55)',
      },
      maxWidth: {
        shell: '68rem',
      },
      height: {
        header: '4.5rem', /* 72px */
        btn:    '3rem',
        input:  '2.75rem',
      },
      minHeight: {
        btn: '3rem',
      },
    }
  }
};
