import type { BetterTabsOptions } from '@/components/custom/BetterTabs.vue';
import { VideoSetting, EffectsSetting, AISubtitle } from './components';

export const tabsOptions: BetterTabsOptions[] = [
  {
    name: 'VideoSetting',
    label: '视频处理',
    renderComponent: () => h(VideoSetting)
  },
  {
    name: '2DSetting',
    label: '2D特效',
    renderComponent: () => h(EffectsSetting)
  },
  {
    name: 'AISubtitle',
    label: 'AI字幕',
    renderComponent: () => h(AISubtitle)
  }
];
