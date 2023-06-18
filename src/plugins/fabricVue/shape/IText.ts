import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import type { ITextProps as FabricITextProps } from '@fabric/shapes/IText/IText';
import type { TProps } from '@fabric/shapes/Object/types';
import { IText } from 'fabric';
import { cloneDeep } from 'lodash-es';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindTextEvent, useWatchUpdateProps, useControls } from '../hooks';
export type FITextProps = TProps<FabricITextProps> & {
  text: string;
};
export type ITextInst = {
  instance: IText;
};
export const iTextProps = {
  config: {
    type: Object as PropType<FITextProps | Record<string, any>>,
    required: true
  }
} as const;
export type ITextProps = typeof iTextProps;
export default defineComponent({
  name: 'FabricIText',
  inheritAttrs: false,
  props: iTextProps,
  setup(props): ITextInst {
    const { injectCanvasContext } = useCanvasContext();
    const canvasInject = injectCanvasContext();
    const { parentInstance } = useObjectParent();
    const { setControls } = useControls();
    const textObject = new IText(props.config.text, props.config);
    setControls(textObject, props.config);
    parentInstance.add(textObject);
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