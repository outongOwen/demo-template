import { watch } from 'vue';
import type { Object as FabricObject, Canvas } from 'fabric';
import { isEmpty } from 'lodash-es';
import { difference } from '../utils';
/**
 * @abstract watch props and update targetObj
 */
export const useWatchUpdateProps = (
  config: () => Record<string, any>,
  targetObj: FabricObject,
  canvasInstance: Canvas
) => {
  if (!config && !targetObj) return;
  watch(
    config,
    (newConfig, oldConfig) => {
      let isRefresh = false;
      if (!oldConfig) return;
      const difProps = difference(newConfig, oldConfig);
      if (isEmpty(difProps)) return;
      Object.entries(difProps).forEach(([key, value]) => {
        targetObj.get(key) !== value && targetObj.set(key, value) && (isRefresh = true);
      });
      isRefresh && canvasInstance.requestRenderAll();
    },
    {
      deep: true
    }
  );
};
