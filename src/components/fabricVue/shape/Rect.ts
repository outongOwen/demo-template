import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Rect } from 'fabric';
import type { RectProps as FabricRectProps } from '@fabric/shapes/Rect';
import type { TProps } from '@fabric/shapes/Object/types';
import { cloneDeep } from 'lodash-es';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindObjectEvent, useWatchUpdateProps } from '../hooks';
export type FRectProps = TProps<FabricRectProps>;
export type RectInst = {
  instance: Rect;
};
/**
 * todo:RectProps 类型完善
 */
export const rectProps = {
  config: {
    type: Object as PropType<FRectProps | Record<string, any>>,
    default: () => {},
    required: true
  }
} as const;
export type RectProps = typeof rectProps;
export default defineComponent({
  name: 'FabricRect',
  inheritAttrs: false,
  props: rectProps,
  setup(props): RectInst {
    const { injectCanvasContext } = useCanvasContext();
    const canvasInject = injectCanvasContext();
    const { parentInstance } = useObjectParent();
    const rectObject = new Rect(props.config as any);
    parentInstance.add(rectObject);
    canvasInject?.instance && useWatchUpdateProps(() => cloneDeep(props.config), rectObject, canvasInject.instance);
    onMounted(() => {
      useBindObjectEvent(rectObject, 'on');
    });
    onBeforeUnmount(() => {
      parentInstance && parentInstance.remove(rectObject);
      useBindObjectEvent(rectObject, 'off');
    });
    return {
      instance: rectObject
    };
  },
  render() {
    return null;
  }
});
