import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Textbox } from 'fabric';
// import {} from '@fabric/shapes/Textbox';
import type { textboxDefaultValues } from '@fabric/shapes/Textbox';
import type { TProps } from '@fabric/shapes/Object/types';
import { cloneDeep } from 'lodash-es';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindTextEvent, useWatchUpdateProps } from '../hooks';
export type FTextboxProps = TProps<
  typeof textboxDefaultValues & {
    text: string;
  }
>;
export type TextboxInst = {
  instance: Textbox;
};
/**
 * todo:TextboxProps 类型完善
 */
export const textboxProps = {
  config: {
    type: Object as PropType<FTextboxProps | Record<string, any>>,
    default: () => {},
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
    const textObject = new Textbox(props.config.text, props.config);
    parentInstance.add(textObject);
    canvasInject?.instance && useWatchUpdateProps(() => cloneDeep(props.config), textObject, canvasInject.instance);
    onMounted(() => {
      useBindTextEvent(textObject, 'on');
    });
    onBeforeUnmount(() => {
      parentInstance && parentInstance.remove(textObject);
      useBindTextEvent(textObject, 'off');
    });
    return {
      instance: textObject
    };
  },
  render() {
    return null;
  }
});
