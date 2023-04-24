import type { VNodeChild } from 'vue';
import { Icon } from '@iconify/vue';
/**
 *
 * @param icon iconify icon name
 * @returns {VNodeChild} iconify icon component
 */
export default function useIconRender(icon: string): () => VNodeChild {
  const IconComponent = () =>
    h(Icon, {
      icon
    }) as VNodeChild;
  return IconComponent;
}
