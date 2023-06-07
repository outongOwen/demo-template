import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Text } from 'fabric';
import { cloneDeep } from 'lodash-es';
import { useCanvasContext } from '../context';
import { useObjectParent, useBindTextEvent, useWatchUpdateProps } from '../hooks';
export type TextInst = {
  instance: Text;
};
/**
 * todo:ITextProps 类型完善
 */
export const textProps = {
  config: {
    type: Object as PropType<any>,
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
    const textObject = new Text(props.config.text, props.config);
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
