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
      height: rowItem?.rowHeight ? rowItem.rowHeight + 'px' : rowHeight + 'px'
    }"
  >
    <TimeLineAction v-for="item in rowItem.actions" :key="item.id" :action-item="item" :row-item="rowItem" />
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs';
import type { Interactable } from '@interactjs/types';
import { useTimeLineContext, useTimeLineStateContext, useTimeLineEditorAreaContext } from '../../../contexts';
import type { TimelineRow } from '../../../types';
import TimeLineAction from '../timeLineAction/index.vue';
import { getRowById, checkIntersectionTime, parserTransformToTime } from '../../../utils';
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
const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { injectTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const { rowHeight, rowBackground, editorData } = toRefs(timeLineContext);
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineStateContext = injectTimeLineStateContext();
const timeLineEditorAreaContext = injectTimeLineEditorAreaContext();
const rowRef = ref<HTMLElement>();
const dragJudge = event => {
  const dropzoneElement = event.target;
  const draggableEvent = event.dragEvent;
  const { top: cTop } = timeLineStateContext.timeLineEditorRef.value!.getBoundingClientRect();
  const { top: rTop, bottom: rBottom, height: rHeight } = dropzoneElement.getBoundingClientRect();
  const ty = rTop - cTop;
  const cy = rTop - cTop + rHeight / 2;
  const by = rBottom - cTop;
  // 计算鼠标相对于拖拽元素的相对位置
  const relativeY = draggableEvent.clientY - cTop;
  const { id: draggableId, left, width } = draggableEvent.target.dataset;
  const { id: dropzoneId } = dropzoneElement.dataset;
  const { start, end } = parserTransformToTime(
    { left: Number(left), width: Number(width) },
    unref(timeLineStateContext.scaleUnit)
  );
  const currentRow = getRowById(dropzoneId, unref(editorData)!);
  // 判断当前action与当前currentRow中action是否存在交集通过start和end
  const intersectState = checkIntersectionTime(
    { targetStart: start, targetEnd: end, targetId: draggableId },
    currentRow!.actions
  );
  // 判断目标action与边相交关系（容错5px）
  if (intersectState) {
    if (relativeY >= cy) {
      timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, by + 5, 'bottom');
    } else {
      timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, ty - 5, 'top');
    }
    return;
  }
  if (relativeY <= ty + 2) {
    timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, ty - 5, 'top');
  } else if (relativeY >= by - 2) {
    timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, by + 5, 'bottom');
  } else {
    timeLineEditorAreaContext.setDropzoneInfo(dropzoneId, cy, 'center');
  }
};
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
  position: relative;
  flex-shrink: 0;
  background-color: v-bind('rowBackground');
  width: 100%;
}
/* .timeLine-editor-row:hover {
  background-color: v-bind('rowActiveBackground');
} */
</style>
