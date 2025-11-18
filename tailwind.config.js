module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FBCC5F',
          50: '#FFFDF5',
          100: '#FFF9E5',
          200: '#FFF0C2',
          300: '#FFE79F',
          400: '#FFDE7C',
          500: '#FBCC5F',
          600: '#E5B84D',
          700: '#CFA43B',
          800: '#B98F29',
          900: '#8F6E1F',
        },
        dark: {
          DEFAULT: '#2B363C',
          lighter: '#3A4850',
          light: '#374450',
          darker: '#1F2A2F',
          darkest: '#151E23',
        },
        darker: '#111827',
        light: {
          DEFAULT: '#F9FAFB',
          darker: '#F3F4F6',
          border: '#E5E7EB',
          text: '#111827',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        "header-height": "80px",
        "footer-height": "48px",
      },
      height: {
        "header-height": "80px",
        "footer-height": "48px",
        "screen-minus-header": "calc(100vh - 80px)",
        "screen-minus-header-footer": "calc(100vh - 128px)",
      },
      animation: {
        'backgroundPulse': 'backgroundPulse 4s ease-in-out infinite',
      },
      keyframes: {
        backgroundPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
