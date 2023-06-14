import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Text } from 'fabric';
import type { TextProps as FabricTextProps } from '@fabric/shapes/Text/Text';
import type { TProps } from '@fabric/shapes/Object/types';
import { cloneDeep } from 'lodash-es';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindTextEvent, useWatchUpdateProps, useControls } from '../hooks';
export type FTextProps = TProps<FabricTextProps> & {
  text: string;
};
export type TextInst = {
  instance: Text;
};
export const textProps = {
  config: {
    type: Object as PropType<FTextProps | Record<string, any>>,
    default: () => {},
    required: true
  }
} as const;
export type TextProps = typeof textProps;
export default defineComponent({
  name: 'FabricText',
  inheritAttrs: false,
  props: textProps,
  setup(props): TextInst {
    const { injectCanvasContext } = useCanvasContext();
    const canvasInject = injectCanvasContext();
    const { parentInstance } = useObjectParent();
    const { setControls } = useControls();
    const textObject = new Text(props.config.text, props.config);
    parentInstance.add(textObject);
    setControls(textObject, props.config);
    canvasInject?.instance && useWatchUpdateProps(() => cloneDeep(props.config), textObject, canvasInject.instance);
    onMounted(() => {
      useBindTextEvent(textObject, 'bind');
    });
    onBeforeUnmount(() => {
      parentInstance && parentInstance.remove(textObject);
      textObject.off();
    });
    return {
      instance: textObject
    };
  },
  render() {
    return null;
  }
});
