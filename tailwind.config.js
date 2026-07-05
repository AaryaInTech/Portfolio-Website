/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./frontend/index.html", "./frontend/app.js"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Map to CSS variables defined in styles.css
        'primary-pink': 'var(--primary-pink)',      
        'accent-green': 'var(--accent-green)',      
        'bg-offwhite': 'var(--bg-offwhite)',       
        'bg-card': 'var(--bg-card)',           
        'bg-soft': 'var(--bg-soft)',           
        'text-dark': 'var(--text-dark)',         
        'text-gray': 'var(--text-gray)',         
        // Dark mode overrides are handled dynamically via CSS variable definitions under .dark
      }
    }
  },
  plugins: [],
}
