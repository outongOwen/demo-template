<!--
 * @Description: TimeLine
 * @abstract: 时间轴编辑器
 * @author: owenTong
 * @since: 2023-06-25
 * TimeLine
-->
<template>
  <div class="timeLine-container">
    <div class="timeLine-inner-wrap">
      <TimeLineSideBar v-if="showSideBar" :scroll-top="scrollTop" />
      <div class="timeLine-editor-wrap" :style="{ width: showSideBar ? `calc(100% - ${sideBarWidth}px)` : '100%' }">
        <TimeLineTimeArea :scroll-left="scrollLeft" />
        <TimeLineCursor :scroll-left="scrollLeft" />
        <TimeLineEditorArea>
          <template #blankPlaceholder>
            <slot name="blankPlaceholder" />
          </template>
        </TimeLineEditorArea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { consola } from 'consola';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
import TimeLineTimeArea from '../timeLineTimeArea/index.vue';
import TimeLineEditorArea from '../timeLineEditorArea/index.vue';
import TimeLineCursor from '../timeLineCursor/index.vue';
import TimeLineSideBar from '../timeLineSideBar/index.vue';
import type { TimelineAction } from '../../types';
import { timeLineProps } from './props';
import { sortTimeLineByType } from './index';
defineOptions({
  name: 'TimeLine'
});
const props = defineProps(timeLineProps);
/**
 * #TODO 需要对props进行校验和初始化操作
 */
const { provideTimeLineContext } = useTimeLineContext();
const { provideTimeLineStateContext } = useTimeLineStateContext();

const {
  showSideBar,
  sideBarWidth,
  editorData,
  mainRow,
  mainRowId,
  background,
  rowSortTypes,
  scaleSmallCellMs,
  scaleSmallCellWidth,
  fps
} = toRefs(props);
const scrollTop = ref(0);
const scrollLeft = ref(0);
provideTimeLineContext(props);
const timeLineStateContext = provideTimeLineStateContext({
  scaleUnit: computed(() => {
    return unref(scaleSmallCellMs)! / unref(scaleSmallCellWidth)!;
  }),
  frameWidth: computed(() => {
    return 1000 / unref(fps)! / (unref(scaleSmallCellMs)! / unref(scaleSmallCellWidth)!);
  }),
  timeLineMaxEndTime: computed(() => {
    if (unref(editorData)) {
      const maxEnd = unref(unref(editorData)).reduce((prev, cur) => {
        // 通过actions中最大end值计算最大宽度
        const maxTime = cur.actions.reduce((aPrev: number, aCur: TimelineAction) => {
          return Math.max(aPrev, aCur.end);
        }, 0);
        return Math.max(prev, maxTime);
      }, 0);
      return maxEnd;
    }
    return 0;
  })
});
useEventListener(timeLineStateContext.timeLineEditorRef, 'scroll', e => {
  const target = e.target as HTMLElement;
  scrollTop.value = target.scrollTop;
  scrollLeft.value = target.scrollLeft;
});
watch(
  [mainRow, mainRowId],
  () => {
    if (!mainRow.value) return;
    if (mainRow.value && !mainRowId.value) {
      consola.warn('mainRowId must be set');
      return;
    }
    const findMainRow = Array.from(unref(editorData).filter(item => item.type === mainRowId?.value)).length;
    if (findMainRow > 1) {
      consola.warn('mainRowId must be unique');
    }
    if (findMainRow === 0) {
      consola.warn('not find matched mainRowId in editorData');
    }
    timeLineStateContext.hasMainRow.value = findMainRow === 1;
  },
  { immediate: true }
);
watch(
  [editorData, rowSortTypes, mainRowId],
  () => {
    // 主时间轴排序
    if (timeLineStateContext.hasMainRow) {
      const mainRowIds = unref(editorData).filter(item => item.type === mainRowId!.value);
      if (mainRowIds.length) {
        const mainRowIndex = unref(editorData).findIndex(item => item.type === mainRowId!.value);
        unref(editorData).push(unref(editorData)[mainRowIndex]);
        unref(editorData).splice(mainRowIndex, 1);
      }
    }
    // 根据时间轴类型进行排序
    if (rowSortTypes?.value?.length && editorData?.value?.length) {
      const sortedEditorData = sortTimeLineByType(unref(editorData), unref(rowSortTypes)!);
      unref(editorData).splice(0, unref(editorData).length);
      unref(editorData).push(...sortedEditorData);
    }
  },
  {
    immediate: true
  }
);
</script>
<style lang="scss" scoped>
.timeLine-container {
  background-color: v-bind('background');
  width: 100%;
  height: 100%;

  .timeLine-inner-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;

    .timeLine-divider {
      height: 100%;
      width: 1px;
      background-color: #000;
    }

    .timeLine-editor-wrap {
      height: 100%;
      width: 100%;
      position: relative;
      overflow: hidden;
    }
  }
}
</style>
