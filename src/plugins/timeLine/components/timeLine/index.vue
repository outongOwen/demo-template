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
      <TimeLineSideBar v-if="showSideBar" :scroll-top="scrollTop">
        <template #default="{ itemRow, sideBarRef }">
          <slot name="sidebar" :item-row="itemRow" :side-bar-ref="sideBarRef" />
        </template>
      </TimeLineSideBar>
      <div class="timeLine-main-wrap" :style="{ width: showSideBar ? `calc(100% - ${sideBarWidth}px)` : '100%' }">
        <TimeLineTimeArea :scroll-left="scrollLeft" />
        <TimeLineCursor />
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

const timeLineStateContext = provideTimeLineStateContext();
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
  leftOffset,
  fps
} = toRefs(props);
const scrollTop = ref(0);
const scrollLeft = ref(0);
useEventListener(timeLineStateContext.timeLineEditorRef, 'scroll', e => {
  const target = e.target as HTMLElement;
  scrollTop.value = target.scrollTop;
  if (target.scrollLeft > leftOffset.value) {
    scrollLeft.value = target.scrollLeft;
  } else {
    scrollLeft.value = 0;
  }
});
provideTimeLineContext(props);
// 计算时间轴缩放单位 （ms/px）
timeLineStateContext.scaleUnit = computed(() => {
  return unref(scaleSmallCellMs)! / unref(scaleSmallCellWidth)!;
});

watch(
  [timeLineStateContext.scaleUnit, fps],
  () => {
    timeLineStateContext.frameWidth.value = 1000 / fps.value / timeLineStateContext.scaleUnit.value;
  },
  { immediate: true }
);
watch(
  [mainRow, mainRowId],
  () => {
    if (!mainRow.value) return;
    if (mainRow.value && !mainRowId.value) {
      consola.warn('mainRowId must be set');
      return;
    }
    const findMainRow = Array.from(editorData.value.filter(item => item.type === mainRowId?.value)).length;
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
      const mainRowIds = editorData.value.filter(item => item.type === mainRowId!.value);
      if (mainRowIds.length) {
        const mainRowIndex = editorData.value.findIndex(item => item.type === mainRowId!.value);
        editorData.value.push(editorData.value[mainRowIndex]);
        editorData.value.splice(mainRowIndex, 1);
      }
    }
    // 根据时间轴类型进行排序
    if (rowSortTypes?.value?.length && editorData?.value?.length) {
      const sortedEditorData = sortTimeLineByType(unref(editorData), unref(rowSortTypes)!);
      editorData.value.splice(0, editorData.value.length);
      editorData.value.push(...sortedEditorData);
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

    .timeLine-track-wrap {
      height: 100%;
      position: relative;
    }
  }
}
</style>
