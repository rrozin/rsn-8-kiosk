import { defineConfig } from 'vite'

export default defineConfig({
    build: {
      outDir: '../public',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.').at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            }
            return `public/[name][extname]`;
          },
          chunkFileNames: 'scripts.js',
          entryFileNames: 'scripts.js',
        },
      },
    }
  })
