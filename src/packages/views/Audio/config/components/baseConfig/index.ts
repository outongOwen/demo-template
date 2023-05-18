import { AudioSettings } from '@/packages/components';
import type { RadioButtonGroupOption } from '@/components/custom/RadioButtonGroup.vue';
export const tabOptions: RadioButtonGroupOption[] = [
  {
    key: 'audio',
    label: '音频',
    renderComponent: () => h(AudioSettings)
  }
];
