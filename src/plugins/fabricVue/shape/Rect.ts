import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Rect } from 'fabric';
import type { RectProps as FabricRectProps } from '@fabric/shapes/Rect';
import { cloneDeep } from 'lodash';
import type { TObjectInstance } from '../types';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindObjectEvent, useWatchUpdateProps, useControls } from '../hooks';
export type FRectProps = Partial<FabricRectProps>;
export type RectInst = {
  instance: TObjectInstance<Rect>;
};
/**
 * todo:RectProps 类型完善
 */
export const rectProps = {
  config: {
    type: Object as PropType<FRectProps | Record<string, any>>,
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
    const { setControls } = useControls();
    const rectObject = new Rect(props.config);
    setControls(rectObject, props.config);
    parentInstance.add(rectObject);
    canvasInject?.instance && useWatchUpdateProps(() => cloneDeep(props.config), rectObject, canvasInject.instance);
    onMounted(() => {
      useBindObjectEvent(rectObject, 'bind');
    });
    onBeforeUnmount(() => {
      parentInstance && parentInstance.remove(rectObject);
      rectObject.off();
    });
    return {
      instance: rectObject
    };
  },
  render() {
    return null;
  }
});
