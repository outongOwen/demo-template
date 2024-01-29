<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->

<template>
  <div
    ref="rowRef"
    class="timeLine-editor-row"
    :data-type="rowItem.type"
    :data-id="rowItem.id"
    :style="{
      height: rowItem?.rowHeight ? rowItem.rowHeight + 'px' : getShareProps.rowHeight + 'px'
    }"
    @contextmenu.stop="handleContextMenu"
  >
    <TimeLineAction
      v-for="item in rowItem.actions"
      :key="item.id"
      :action-item="item"
      :row-item="rowItem"
      :action-height="rowItem?.rowHeight ? rowItem.rowHeight : getShareProps.rowHeight!"
    />
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs';
import type { Interactable } from '@interactjs/types';
import { useTimeLineEditorAreaContext } from '../../../contexts';
import type { TimelineRow } from '../../../types';
import TimeLineAction from '../timeLineAction/index.vue';
import { getRowById, checkIntersectionTime, parserTransformToTime } from '../../../utils';
import { useTimeLineStore } from '../../../store';
interface Props {
  rowItem: TimelineRow;
}
interface Expose {
  rowRef: Ref<HTMLElement | undefined>;
}
defineOptions({
  name: 'TimeLineRow'
});
const props = defineProps<Props>();
const { rowItem } = toRefs(props);
const { injectTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const timeLineEditorAreaContext = injectTimeLineEditorAreaContext();
const { timeLineEditorViewSize, getScaleUnit, getShareProps, getTimeLineEditorData } = useTimeLineStore();
const rowRef = ref<HTMLElement>();
// 右键菜单
const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  // console.log(event.clientX, event.clientY);
};
// 拖拽判断
const dragJudge = event => {
  const dropzoneElement = event.target;
  const draggableEvent = event.dragEvent;
  const { top: cTop } = timeLineEditorViewSize;
  const { top: rTop, bottom: rBottom, height: rHeight } = dropzoneElement.getBoundingClientRect();
  const ty = rTop - unref(cTop);
  const cy = rTop - unref(cTop) + rHeight / 2;
  const by = rBottom - unref(cTop);
  // 计算鼠标相对于拖拽元素的相对位置
  const relativeY = draggableEvent.clientY - unref(cTop);
  const { id: draggableId, left, width } = draggableEvent.target.dataset;
  const { id: dropzoneId } = dropzoneElement.dataset;
  const { start, end } = parserTransformToTime({ left: Number(left), width: Number(width) }, unref(getScaleUnit));
  const currentRow = getRowById(dropzoneId, unref(getTimeLineEditorData));
  // 判断当前action与当前currentRow中action是否存在交集通过start和end
  const intersectState = checkIntersectionTime(
    { targetStart: start, targetEnd: end, targetId: draggableId },
    currentRow!.actions
  );
  // 判断目标action与边相交关系（容错5px）
  if (intersectState) {
    if (relativeY >= cy) {
      timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, by + Number(getShareProps.rowSpacing!) / 2, 'bottom');
    } else {
      timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, ty - Number(getShareProps.rowSpacing!) / 2, 'top');
    }
    return;
  }
  if (relativeY <= ty + 2) {
    timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, ty - Number(getShareProps.rowSpacing!) / 2, 'top');
  } else if (relativeY >= by - 2) {
    timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, by + Number(getShareProps.rowSpacing!) / 2, 'bottom');
  } else {
    timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, cy, 'center');
  }
};
onBeforeUnmount(() => {
  interact(rowRef.value!).unset();
});
const initInteractDropzone = () => {
  interact(rowRef.value!).dropzone({
    accept: ({ dropzone, draggableElement }: { dropzone: Interactable; draggableElement: Element }) => {
      if (rowItem.value.includes?.length) {
        return rowItem.value.includes.includes(draggableElement.getAttribute('data-type')!);
      }
      if (rowItem.value.excludes?.length) {
        return !rowItem.value.excludes.includes(draggableElement.getAttribute('data-type')!);
      }
      return (dropzone.target as Element).getAttribute('data-type') === draggableElement.getAttribute('data-type');
    },
    overlap: 'pointer',
    ondragenter(event) {
      dragJudge(event);
    },
    ondropmove(event) {
      dragJudge(event);
    },
    ondragleave(event) {
      dragJudge(event);
    }
  });
};
onMounted(() => {
  initInteractDropzone();
});
defineExpose<Expose>({
  rowRef
});
</script>

<style scoped>
.timeLine-editor-row {
  flex-shrink: 0;
  background-color: v-bind('getShareProps.rowBackground');
  position: relative;
}
/* .timeLine-editor-row:hover {
  background-color: v-bind('rowActiveBackground');
} */
</style>
