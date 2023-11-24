import { RotateSetting, TextStyleSetting } from '@/packages/components';
import type { ConfigTabOptions } from '@/components/module/packages/configurationContent/index.vue';
// const text = ref<string>('hello world');
const materialData = reactive({
  turnHorizontal: false,
  turnVertical: false,
  fontFamily: '',
  color: '',
  fontSize: 16,
  strokeSwitch: false,
  stroke: '',
  strokeWidth: 5,
  rotate: 0,
  textAlign: 'center',
  fontWeight: 'normal',
  fontStyle: ''
});
export const baseConfigOptions: ConfigTabOptions[] = [
  {
    key: 'Style',
    label: '样式',
    renderComponent: () =>
      h(TextStyleSetting, {
        materialData
      })
  },
  {
    key: 'Rotate',
    label: '旋转',
    renderComponent: () =>
      h(RotateSetting, {
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
