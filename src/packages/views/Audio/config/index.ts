import type { BetterTabsOptions } from '@/components/custom/BetterTabs.vue';
import EffectConfig from './components/effectConfig/index.vue';
import { BaseConfig } from './components';
interface ExtendBetterTabsOptions extends BetterTabsOptions {
  hideRadioGroup?: boolean;
}
export const tabsOptions: ExtendBetterTabsOptions[] = [
  {
    name: 'BaseSettings',
    label: '基础设置',
    renderComponent: () => h(BaseConfig)
  },
  {
    name: 'EffectConfig',
    label: '音效设置',
    renderComponent: () => h(EffectConfig)
  }
];
