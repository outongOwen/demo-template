import { ref } from 'vue';
import { createGlobalState, reactiveComputed } from '@vueuse/core';
export const useTimeLineClipStore = createGlobalState(() => {
  // 时间线行y轴坐标信息集合 Set类型
  const rowY = ref<
    Set<{
      id: string;
      top: number;
      center: number;
      bottom: number;
    }>
  >(new Set());
  // action X轴坐标信息集合 Set类型
  const actionX = ref<
    Set<{
      rowId: string;
      id: string;
      left: number;
      right: number;
    }>
  >(new Set());
  /** *******************getters**************************/
  const getters = {
    // 获取时间线行y轴坐标信息
    getRowY: computed(() => {
      return rowY.value;
    }),
    // 获取action X轴坐标信息
    getActionX: computed(() => {
      return actionX.value;
    }),
    // 坐标集合
    getPos: reactiveComputed(() => {
      const pos: {
        y: {
          id: string;
          top: number;
          center: number;
          bottom: number;
        }[];
        x: {
          rowId: string;
          id: string;
          left: number;
          right: number;
        }[];
      } = {
        y: [],
        x: []
      };
      rowY.value.forEach(item => {
        pos.y.push(item);
      });
      actionX.value.forEach(item => {
        pos.x.push(item);
      });
      return pos;
    })
  };
  const actions = {
    // 设置时间线行y轴坐标信息
    setRowY: (id: string, pos: { top: number; center: number; bottom: number }) => {
      // 判断是否存在，存在更新，不存在添加
      let isExist = false;
      rowY.value.forEach(item => {
        if (item.id === id) {
          isExist = true;
        }
      });
      if (isExist) {
        rowY.value.forEach(item => {
          if (item.id === id) {
            item.top = pos.top;
            item.center = pos.center;
            item.bottom = pos.bottom;
          }
        });
      } else {
        rowY.value.add({
          id,
          top: pos.top,
          center: pos.center,
          bottom: pos.bottom
        });
      }
    },
    // 删除时间线行y轴坐标信息
    deleteRowY: (id: string) => {
      rowY.value.forEach(item => {
        if (item.id === id) {
          rowY.value.delete(item);
        }
      });
    },
    // 设置action X轴坐标信息
    setActionX: (id: string, rowId: string, pos: { left: number; right: number }) => {
      // 判断是否存在，存在更新，不存在添加
      let isExist = false;
      actionX.value.forEach(item => {
        if (item.id === id) {
          isExist = true;
        }
      });
      if (isExist) {
        actionX.value.forEach(item => {
          if (item.id === id) {
            item.left = pos.left;
            item.right = pos.right;
          }
        });
      } else {
        actionX.value.add({
          id,
          rowId,
          left: pos.left,
          right: pos.right
        });
      }
    },
    // 删除action X轴坐标信息
    deleteActionX: (id: string) => {
      actionX.value.forEach(item => {
        if (item.id === id) {
          actionX.value.delete(item);
        }
      });
    }
  };
  return {
    ...getters,
    ...actions
  };
});
