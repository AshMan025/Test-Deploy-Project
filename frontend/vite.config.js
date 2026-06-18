import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// This vite.config.js file configures a Vite project that uses React and Tailwind CSS.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
