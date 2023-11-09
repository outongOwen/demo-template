import { VolumeSettings, FeatSettings, VideoOperate } from '@/packages/components';
import type { ConfigTabOptions } from '@/components/module/packages/configurationContent/index.vue';

const materialData = reactive({
  volume: 50,
  enterTime: 0,
  leaveTime: 0,
  speed: 1
});
export const baseConfigOptions: ConfigTabOptions[] = [
  {
    key: 'Volume',
    label: '音量',
    renderComponent: () =>
      h(VolumeSettings, {
        materialData
      })
  },
  {
    key: 'Feat',
    label: '淡入淡出',
    renderComponent: () =>
      h(FeatSettings, {
        materialData
      })
  },
  {
    key: 'Operate',
    label: '抓取',
    renderComponent: () => h(VideoOperate)
  }
];
// const tabOptions = ref<TabOptions[]>([
//   {
//     key: 'AudioSettings',
//     label: '音频设置',
//     renderComponent: () => import('./components/audioSettings/index.vue'),
//   },
//   {
//     key: 'AudioSettings2',
//     label: '音频设置2',
//     renderComponent: () => import('./components/audioSettings/index.vue'),
//   },
// ]);
