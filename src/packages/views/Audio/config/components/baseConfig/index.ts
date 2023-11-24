import { AudioSettings, TextSettings } from '@/packages/components';
import type { ConfigTabOptions } from '@/components/module/packages/configurationContent/index.vue';
const text = ref<string>('hello world');
const materialData = reactive({
  volume: 50,
  enterTime: 0,
  leaveTime: 0,
  speed: 1
});
export const baseConfigOptions: ConfigTabOptions[] = [
  {
    key: 'AudioSettings',
    label: '音频',
    renderComponent: () =>
      h(AudioSettings, {
        materialData
      })
  },
  {
    key: 'TextSettings',
    label: '文本',
    renderComponent: () =>
      h(TextSettings, {
        text: text.value,
        'onUpdate:text': (value: string) => {
          text.value = value;
        }
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
