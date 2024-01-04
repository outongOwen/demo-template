import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import unocss from '@unocss/vite';
import progress from 'vite-plugin-progress';
import VueDevtools from 'vite-plugin-vue-devtools';
import mockDevServerPlugin from 'vite-plugin-mock-dev-server';
import unplugin from './unplugin';
import visualizer from './visualizer';
import compress from './compress';
import compression from './compression';
import pwa from './pwa';
/**
 * vite插件
 * @param viteEnv - 环境变量配置
 */
export function setupVitePlugins(viteEnv: ImportMetaEnv): (PluginOption | PluginOption[])[] {
  const plugins = [VueDevtools(), vue(), vueJsx(), ...unplugin(viteEnv), unocss(), progress()];

  if (viteEnv.VITE_VISUALIZER === 'Y') {
    plugins.push(visualizer as PluginOption);
  }
  if (viteEnv.VITE_COMPRESS === 'Y') {
    plugins.push(compress(viteEnv));
  }
  if (viteEnv.VITE_PWA === 'Y' || viteEnv.VITE_VERCEL === 'Y') {
    plugins.push(pwa());
  }
  if (viteEnv.VITE_USE_MOCK === 'Y') {
    // plugins.push(mock());
    plugins.push(
      mockDevServerPlugin({
        // exclude: ['_utils.ts']
      })
    );
  }
  if (viteEnv.VITE_COMPRESSION === 'Y') {
    plugins.push(compression(viteEnv));
  }
  return plugins;
}
