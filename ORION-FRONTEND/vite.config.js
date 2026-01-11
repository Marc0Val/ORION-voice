import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ya no necesitamos viteStaticCopy
// import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
  ],
});