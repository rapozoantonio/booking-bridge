import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// PostCSS configuration is handled separately in postcss.config.js
export default defineConfig({
  plugins: [
    react({
      // This ensures JSX is processed in both .js and .jsx files
      include: ['**/*.jsx', '**/*.js'],
      jsxRuntime: 'automatic',
    }),
  ],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/analytics'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [{
        name: 'jsx-in-js',
        setup(build) {
          build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
            loader: 'jsx',
          }));
        },
      }],
      loader: {
        '.js': 'jsx',
      },
    },
    include: ['react', 'react-dom', 'react-router-dom']
  },
});