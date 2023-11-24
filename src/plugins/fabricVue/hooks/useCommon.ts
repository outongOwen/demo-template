import { getCurrentInstance } from 'vue';
import type { Canvas, Group } from 'fabric';
import { some } from 'lodash';
import { useCanvasContext, useGroupContext } from '../context';
import { throwError } from '../utils';
interface UseObjectParentReturn {
  parentInstance: Group | Canvas;
  parentType: 'group' | 'canvas';
}
/**
 * 通过父级组件的名称获取父级注入数据
 * @return {Object} 父级注入数据
 */
export const useObjectParent = (): UseObjectParentReturn => {
  const { injectCanvasContext } = useCanvasContext();
  const { injectGroupContext } = useGroupContext();
  const canvasInject = injectCanvasContext();
  const ctx = getCurrentInstance();
  let parentType: 'group' | 'canvas' = 'canvas';
  if (!canvasInject || !ctx) {
    throwError('Shape', 'must be placed inside Canvas');
  }
  let parentInstance: Group | Canvas | null = null;
  if (some(ctx.parent, { type: { name: 'FabricGroup' } })) {
    const groupInject = injectGroupContext();
    if (groupInject?.instance) {
      parentInstance = groupInject.instance;
      parentType = 'group';
    }
  } else if (canvasInject.instance) {
    parentInstance = canvasInject.instance;
  }

  if (!parentInstance) {
    throwError('Shape', 'must be placed inside Canvas/Group');
  }
  return {
    parentInstance,
    parentType
  };
};
