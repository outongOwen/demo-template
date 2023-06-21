import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Textbox } from 'fabric';
// import {} from '@fabric/shapes/Textbox';
import type { textboxDefaultValues } from '@fabric/shapes/Textbox';
import { cloneDeep } from 'lodash-es';
import type { TProps, TObjectInstance } from '../types';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindTextEvent, useWatchUpdateProps, useControls } from '../hooks';
export type FTextboxProps = TProps<
  typeof textboxDefaultValues & {
    text: string;
  }
>;
export type TextboxInst = {
  instance: TObjectInstance<Textbox>;
};
export const textboxProps = {
  config: {
    type: Object as PropType<FTextboxProps | Record<string, any>>,
    required: true
  }
} as const;
export type TextboxProps = typeof textboxProps;
export default defineComponent({
  name: 'FabricTextbox',
  inheritAttrs: false,
  props: textboxProps,
  setup(props): TextboxInst {
    const { injectCanvasContext } = useCanvasContext();
    const canvasInject = injectCanvasContext();
    const { parentInstance } = useObjectParent();
    const { setControls } = useControls();
    const textObject = new Textbox(props.config.text, props.config);
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
