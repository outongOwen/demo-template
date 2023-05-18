import type { TabsOptions } from '@/components/custom/BetterTabs.vue';
import { BaseConfig } from './components';

export const tabsOptions: TabsOptions[] = [
  {
    name: 'baseSettings',
    label: '基础设置',
    renderComponent: () => h(BaseConfig)
  }
];
