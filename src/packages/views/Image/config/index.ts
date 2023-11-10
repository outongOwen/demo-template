import type { BetterTabsOptions } from '@/components/custom/BetterTabs.vue';
import { ImageBaseConfig } from './components';

export const tabsOptions: BetterTabsOptions[] = [
  {
    name: 'baseConfig',
    label: '默认设置',
    renderComponent: () => h(ImageBaseConfig)
  }
];
