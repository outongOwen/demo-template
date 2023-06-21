import type { PropType } from 'vue';
import { defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { Group } from 'fabric';
// import type { GroupOwnProps as FGroupProps } from 'fabric';
import { cloneDeep } from 'lodash-es';
import type { GroupProps as FabricGroupProps } from '@fabric/shapes/Group';
import type { TProps, TObjectInstance } from '../types';
import { throwError } from '../utils';
import { useBindObjectEvent, useWatchUpdateProps, useControls } from '../hooks';
import { useCanvasContext, useGroupContext } from '../context';
export interface FGroupProps extends TProps<FabricGroupProps> {}
export type GroupInst = {
  instance: TObjectInstance<Group>;
};
export const groupProps = {
  config: {
    type: Object as PropType<FGroupProps | Record<string, any>>,
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
    const { setControls } = useControls();
    const canvasInject = injectCanvasContext();
    if (!canvasInject?.instance) {
      throwError('Group', 'must be placed inside Canvas');
    }
    const { instance: canvasInstance } = canvasInject;
    // 创建组
    const groupObject = new Group();
    groupObject.set(props.config);
    // 添加自定义控件
    setControls(groupObject, props.config);
    canvasInstance.add(groupObject);
    provideGroupContext({
      instance: groupObject
    });
    useWatchUpdateProps(() => cloneDeep(props.config), groupObject, canvasInject.instance);
    onMounted(() => {
      useBindObjectEvent(groupObject, 'bind');
    });
    onBeforeUnmount(() => {
      canvasInstance?.remove(groupObject);
      groupObject.off();
    });
    return {
      instance: groupObject
    };
  },
  render() {
    return this.$slots.default ? this.$slots.default() : [];
  }
});
