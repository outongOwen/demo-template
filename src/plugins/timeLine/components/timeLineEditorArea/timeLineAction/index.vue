<template>
  <div
    ref="actionRef"
    class="timeLine-editor-action"
    @click.stop="handleClick"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div v-show="isSelected" class="active-box">
      <div class="left-handle" />
      <div class="right-handle" />
    </div>
    <div class="wh-full flex-center relative">
      <div class="absolute top--20px left-0 flex flex-nowrap text-nowrap">
        {{ actionItem.id }}
        {{ selectedActionIds }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimelineAction } from '../../../types';
import timeLineActionHook from './index';
interface Props {
  actionItem: TimelineAction;
}
defineOptions({
  name: 'TimeLineAction'
});
const props = defineProps<Props>();
const { actionItem } = toRefs(props);
const actionRef = ref<HTMLElement>();
const {
  isSelected,
  initInteractResizable,
  initInteractDraggable,
  handleClick,
  handleMouseUp,
  handleMouseDown,
  selectedActionIds
} = timeLineActionHook(actionRef, actionItem);

onMounted(() => {
  initInteractResizable();
  initInteractDraggable();
});
</script>

<style scoped lang="scss">
.timeLine-editor-action {
  position: absolute;
  background-color: #000;
  border-radius: 2px;
  z-index: 1;
  height: 100%;
  .active-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 2px;
    overflow: hidden;
    box-sizing: border-box;
    // 上部分
    .left-handle,
    .right-handle {
      position: absolute;
      width: 5px;
      background-color: #fff;
      cursor: ew-resize;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      bottom: 0;
    }
    .left-handle {
      left: 0px;
      // border-top-left-radius: 2px;
      // border-bottom-left-radius: 2px;
    }
    .right-handle {
      right: 0px;
      // border-top-right-radius: 2px;
      // border-bottom-right-radius: 2px;
    }
    .left-handle::before,
    .right-handle::before {
      background-color: #000;
      content: '';
      display: block;
      height: 10px;
      width: 2px;
    }
  }
  .active-box::before,
  .active-box::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #fff;
  }
  .active-box::before {
    top: 0;
  }
  .active-box::after {
    bottom: 0;
  }
}
</style>
