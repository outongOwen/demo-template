import { defineConfig, loadEnv } from 'vite';
import { createViteProxy, getRootPath, getSrcPath, setupVitePlugins, viteDefine } from './build';
import { getServiceEnvConfig } from './.env-config';
export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as ImportMetaEnv;

  const rootPath = getRootPath();
  const srcPath = getSrcPath();

  const isOpenProxy = viteEnv.VITE_HTTP_PROXY === 'Y';
  const envConfig = getServiceEnvConfig(viteEnv);

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    define: viteDefine,
    plugins: setupVitePlugins(viteEnv),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import './src/styles/scss/global.scss';`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8200,
      open: true,
      proxy: createViteProxy(isOpenProxy, envConfig)
    },
    optimizeDeps: {
      include: ['splitpanes']
    },
    build: {
      outDir: viteEnv.VITE_APP_NAME,
      reportCompressedSize: false,
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
          // manualChunks(id) {
          //   // 根据模块的路径或名称，将需要放在同一个块中的模块归为一类
          //   if (id.includes('src/packages/publicSettingConfig/')) {
          //     return 'publicSettingConfig';
          //   }
          //   if (id.includes('node_modules')) {
          //     return 'vendor';
          //   }
          //   return [];
          // }
        }
      },
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  };
});
