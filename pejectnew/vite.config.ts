import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Ensuring relative paths for assets after build
  resolve: {
    alias: {
      '@': '/src' // Alias for cleaner imports, matches tsconfig.json paths
    }
  }
})
