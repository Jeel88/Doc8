/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--bg-dark)',
                card: 'var(--bg-card)',
                primary: {
                    DEFAULT: 'var(--primary)',
                    hover: 'var(--primary-hover)',
                },
                accent: {
                    cyan: 'var(--accent-cyan)',
                    pink: 'var(--accent-pink)',
                },
                muted: 'var(--text-muted)',
                'bg-dark': '#0a0a0b', // Fallback
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
