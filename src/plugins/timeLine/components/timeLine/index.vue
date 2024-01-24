<!--
 * @Description: TimeLine
 * @abstract: 时间轴编辑器
 * @author: owenTong
 * @since: 2023-06-25
 * TimeLine
-->
<template>
  <div ref="timeLineContainerRef" class="timeLine-container">
    <div class="timeLine-inner-wrap">
      <TimeLineSideBar v-if="showSideBar" />
      <div
        class="timeLine-editor-wrap"
        :style="{
          width: showSideBar ? `calc(100% - ${sideBarWidth}px)` : '100%'
        }"
        @click="handleClick"
        @mousedown="() => (isMouseDown = true)"
        @mouseup="() => (isMouseUp = true)"
        @wheel="handleWheel"
      >
        <TimeLineTimeArea />
        <TimeLineCursor v-if="editorData.length && !hideCursor" />
        <TimeLineEditorArea />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { consola } from 'consola';
import { useTimeLineContext, useTimeLineStateContext, useTimeLineEditorAreaContext } from '../../contexts';
import TimeLineTimeArea from '../timeLineTimeArea/index.vue';
import TimeLineEditorArea from '../timeLineEditorArea/index.vue';
import TimeLineCursor from '../timeLineCursor/index.vue';
import TimeLineSideBar from '../timeLineSideBar/index.vue';
import type { TimelineAction, TimelineExpose } from '../../types';
import { useActionGuideLine } from '../../hooks';
import { timeLineProps } from './props';
import { sortTimeLineByType } from './index';
interface Emits {
  (event: 'maxEndTimeChange', payload: { time: number }): void;
}
defineOptions({
  name: 'TimeLine'
});
const props = defineProps(timeLineProps);
const emits = defineEmits<Emits>();
const { provideTimeLineContext } = useTimeLineContext();
const { provideTimeLineStateContext } = useTimeLineStateContext();
const { provideTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const {
  showSideBar,
  sideBarWidth,
  editorData,
  actionEffects,
  mainRow,
  mainRowId,
  background,
  rowSortTypes,
  scaleSmallCellMs,
  scaleSmallCellWidth,
  fps,
  hideCursor,
  leftOffset
} = toRefs(props);
provideTimeLineContext(props);
const timeLineContainerRef = ref<HTMLElement>();
const timeLineStateContext = provideTimeLineStateContext();
const timeLineEditorAreaContext = provideTimeLineEditorAreaContext({
  editorData
});
const isMouseDown = ref(false);
const isMouseUp = ref(false);

// 注册辅助线
useActionGuideLine();
// 点击时间线
const handleClick = (event: MouseEvent) => {
  if (isMouseDown.value && isMouseUp.value) {
    timeLineStateContext.enginePause();
    timeLineStateContext.setCursorByPos(event.clientX, leftOffset.value);
    timeLineEditorAreaContext.clearSelected();
  }
  isMouseDown.value = false;
  isMouseUp.value = false;
};
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
watch(timeLineStateContext.timeLineMaxEndTime, time => {
  emits('maxEndTimeChange', { time });
});
watchEffect(() => {
  timeLineStateContext.engineRef.value.effects = actionEffects.value;
});
watchEffect(() => {
  timeLineStateContext.engineRef.value.data = editorData.value;
  unref(timeLineStateContext.engineRef).reRender();
});
watchEffect(() => {
  timeLineStateContext.frameWidth.value = 1000 / unref(fps)! / (unref(scaleSmallCellMs)! / unref(scaleSmallCellWidth)!);
});
watchEffect(() => {
  timeLineStateContext.scaleUnit.value = unref(scaleSmallCellMs)! / unref(scaleSmallCellWidth)!;
});
watchEffect(() => {
  timeLineStateContext.timeLineMaxEndTime.value = unref(editorData).reduce((prev, cur) => {
    // 通过actions中最大end值计算最大宽度
    const maxTime = cur.actions.reduce((aPrev: number, aCur: TimelineAction) => {
      return Math.max(aPrev, aCur.end);
    }, 0);
    return Math.max(prev, maxTime);
  }, 0);
});
onMounted(() => {
  unref(timeLineStateContext.engineRef).on('play', () => {
    timeLineStateContext.isPlaying.value = true;
  });
  unref(timeLineStateContext.engineRef).on('paused', () => {
    timeLineStateContext.isPlaying.value = false;
  });
  unref(timeLineStateContext.engineRef).on('setTimeByTick', ({ time }) => {
    let left = (time * 1000) / timeLineStateContext.scaleUnit.value;
    left -= left % timeLineStateContext.frameWidth.value;
    const curTime = Math.round(left * timeLineStateContext.scaleUnit.value);
    timeLineStateContext.handleSetCursor(curTime, false);
  });
});
onBeforeUnmount(() => {
  unref(timeLineStateContext.engineRef).off('play');
  unref(timeLineStateContext.engineRef).off('paused');
  unref(timeLineStateContext.engineRef).off('setTimeByTick');
});
const handleWheel = event => {
  event.preventDefault();
  const deltaX = event.deltaX;
  const deltaY = event.deltaY;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    nextTick(() => {
      timeLineStateContext.timeLineEditorRef.value?.scrollBy(deltaX, 0);
    });
  } else {
    nextTick(() => {
      timeLineStateContext.timeLineEditorRef.value?.scrollBy(0, deltaY);
    });
  }
};
defineExpose<TimelineExpose>({
  get targetEl() {
    return timeLineContainerRef.value!;
  },
  get listener() {
    return unref(timeLineStateContext.engineRef);
  },
  get isPlaying() {
    return unref(timeLineStateContext.engineRef).isPlaying;
  },
  get isPaused() {
    return unref(timeLineStateContext.engineRef).isPaused;
  },
  setPlayRate: unref(timeLineStateContext.engineRef).setPlayRate.bind(unref(timeLineStateContext.engineRef)),
  getPlayRate: unref(timeLineStateContext.engineRef).getPlayRate.bind(unref(timeLineStateContext.engineRef)),
  reRender: unref(timeLineStateContext.engineRef).reRender.bind(unref(timeLineStateContext.engineRef)),
  setTime: time => {
    timeLineStateContext.handleSetCursor(time);
  },
  getTime: unref(timeLineStateContext.engineRef).getTime.bind(unref(timeLineStateContext.engineRef)),
  play: (param?: Parameters<TimelineExpose['play']>[0]): boolean => {
    return timeLineStateContext.enginePlay({ ...param });
  },
  pause: timeLineStateContext.enginePause.bind(unref(timeLineStateContext.engineRef)),
  setScrollLeft: (val: number) => {
    timeLineStateContext.timeLineEditorRef.value?.scrollBy(val, 0);
  }
});
</script>
<style lang="scss" scoped>
.timeLine-container {
  background-color: v-bind('background');
  width: 100%;
  height: 100%;
  user-select: none;
  touch-action: none;
  .timeLine-inner-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    .timeLine-divider {
      height: 100%;
      width: 1px;
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
