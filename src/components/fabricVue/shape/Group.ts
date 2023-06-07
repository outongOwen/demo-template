import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Group } from 'fabric';
// import type { GroupOwnProps as FGroupProps } from 'fabric';
import { cloneDeep } from 'lodash-es';
import { throwError } from '../utils';
import { useBindObjectEvent, useWatchUpdateProps } from '../hooks';
import { useCanvasContext, useGroupContext } from '../context';
export type GroupInst = {
  instance: Group;
};
export const groupProps = {
  config: {
    type: Object as PropType<Partial<typeof Group>>,
    default: () => {},
    required: true
  }
} as const;
export type GroupProps = typeof groupProps;
export interface GroupPublicInterface {
  instance: Group;
}
export default defineComponent({
  name: 'FabricGroup',
  inheritAttrs: false,
  props: groupProps,
  setup(props): GroupInst {
    const { injectCanvasContext } = useCanvasContext();
    const { provideGroupContext } = useGroupContext();
    const canvasInject = injectCanvasContext();
    if (!canvasInject?.instance) {
      throwError('Group', 'must be placed inside Canvas');
    }
    const { instance: canvasInstance } = canvasInject;
    // 创建组
    const groupObject = new Group();
    props.config && groupObject.set(props.config);
    canvasInstance.add(groupObject);
    provideGroupContext({
      instance: groupObject
    });
    useWatchUpdateProps(() => cloneDeep(props.config), groupObject, canvasInject.instance);
    onMounted(() => {
      useBindObjectEvent(groupObject, 'on');
    });
    onBeforeUnmount(() => {
      canvasInstance?.remove(groupObject);
      useBindObjectEvent(groupObject, 'off');
    });
    return {
      instance: groupObject
    };
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  }
});
