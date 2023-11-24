import { RotateSetting, MoveSetting } from '@/packages/components';
import type { ConfigTabOptions } from '@/components/module/packages/configurationContent/index.vue';
// const text = ref<string>('hello world');
const materialData = reactive({
  turnHorizontal: false,
  turnVertical: false,
  rotate: 0,
  offsetLeft: 0,
  offsetTop: 0
});
export const baseConfigOptions: ConfigTabOptions[] = [
  {
    key: 'Rotate',
    label: '旋转',
    renderComponent: () =>
      h(RotateSetting, {
        materialData
      })
  },
  {
    key: 'Move',
    label: '移动',
    renderComponent: () =>
      h(MoveSetting, {
        materialData
      })
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
