import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/character_counter/',
  plugins: [
    tailwindcss(),
  ],
})