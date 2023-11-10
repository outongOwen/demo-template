import { RotateSetting, MoveSetting } from '@/packages/components';
import type { ConfigTabOptions } from '@/components/module/packages/configurationContent/index.vue';
// const text = ref<string>('hello world');
// const materialData = reactive({
//   volume: 50,
//   enterTime: 0,
//   leaveTime: 0,
//   speed: 1
// });
export const baseConfigOptions: ConfigTabOptions[] = [
  {
    key: 'Rotate',
    label: '旋转',
    renderComponent: () => h(RotateSetting)
  },
  {
    key: 'Move',
    label: '移动',
    renderComponent: () => h(MoveSetting)
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
