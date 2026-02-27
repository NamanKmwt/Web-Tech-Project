/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'carbon-black': '#0B0B0B',
                'titanium-silver': '#E1E1E1',
                'f1-red': '#FF1801',
                'f1-dark': '#15151E',
                'f1-gray': '#38383F',
            },
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(to bottom, rgba(11, 11, 11, 0.4), #0B0B0B)',
            }
        },
    },
    plugins: [],
}
