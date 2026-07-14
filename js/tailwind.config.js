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
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'Nunito', 'system-ui', 'sans-serif'],
        display: ['Quicksand', 'Nunito', 'system-ui', 'sans-serif'],
        accent: ['Quicksand', 'Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(31, 92, 54, 0.10)',
        card: '0 2px 12px -2px rgba(18, 22, 26, 0.06), 0 8px 28px -8px rgba(18, 22, 26, 0.08)',
        lift: '0 16px 40px -12px rgba(18, 22, 26, 0.14)',
        nav:  '0 4px 24px -4px rgba(31, 92, 54, 0.12)',
      },
      maxWidth: {
        shell: '68rem',
      }
    }
  }
};
