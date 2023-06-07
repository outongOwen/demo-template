import { getCurrentInstance } from 'vue';
import type { Canvas, Group } from 'fabric';
import { useCanvasContext, useGroupContext } from '../context';
import { throwError } from '../utils';
/**
 * 通过父级组件的名称获取父级注入数据
 * @return {Object} 父级注入数据
 */
export const useObjectParent = () => {
  const { injectCanvasContext } = useCanvasContext();
  const { injectGroupContext } = useGroupContext();
  const canvasInject = injectCanvasContext();
  const currentInstance = getCurrentInstance();
  if (!currentInstance?.parent) {
    throwError('Shape', 'not found currentInstance');
  }
  const parentComponentName = currentInstance.parent.type.name;
  if (!canvasInject?.instance) {
    throwError('Shape', 'must be placed inside Canvas');
  }
  let parentInstance: Group | Canvas | null = null;
  let parentClassName = 'Canvas';
  if (parentComponentName === 'FabricCanvas' && canvasInject?.instance) {
    parentClassName = 'Canvas';
    parentInstance = canvasInject.instance;
  }
  if (parentComponentName === 'FabricGroup') {
    const groupInject = injectGroupContext();
    if (groupInject?.instance) {
      parentClassName = 'Group';
      parentInstance = groupInject.instance;
    }
  }
  if (!parentInstance) {
    throwError('Shape', 'must be placed inside Canvas/Group');
  }
  return {
    parentInstance,
    parentClassName
  };
};
