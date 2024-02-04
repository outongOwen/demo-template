<!--
 * @Description: TimeLine
 * @abstract: 时间轴编辑器
 * @author: owenTong
 * @since: 2023-06-25
 * TimeLine
-->
<template>
  <div ref="timeLineContainerRef" class="timeLine-container">
    <TestPanel />
    <div class="timeLine-inner-wrap">
      <TimeLineSideBar v-if="showSideBar" />
      <div
        class="timeLine-editor-emitter-layer"
        :style="{
          width: showSideBar ? `calc(100% - ${sideBarWidth}px)` : '100%'
        }"
      >
        <div
          class="timeLine-editor-wrap"
          @click="handleClick"
          @wheel="handleEmitterLayerWheel"
          @mousedown="handlerMouseDown"
          @mouseup="handlerMouseUp"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          {{ getPreviewCursorState }}
          {{ getEngineState }}
          <TimeLineScaleArea />
          <TimeLineClipArea />
          <TimeLineCursor v-if="editorData.length && !hideCursor" />
          <TimeLinePreviewCursor v-if="getPreviewCursorState.state" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from 'lodash';
import { watchArray } from '@vueuse/core';
import { useTimeLineEditorAreaContext } from '../../contexts';
import TimeLineScaleArea from '../timeLineScaleArea/index.vue';
import TimeLineClipArea from '../timeLineClipArea/index.vue';
import TimeLineCursor from '../timeLineCursor/index.vue';
import TimeLineSideBar from '../timeLineSideBar/index.vue';
import TimeLinePreviewCursor from '../timeLinePreviewCursor/index.vue';
import { useActionGuideLine } from '../../hooks';
import type { TimelineExpose } from '../../types';
import { useTimeLineStore, useTimeLineScaleStore } from '../../store';
import TestPanel from './testPanel.vue';
import { timeLineProps } from './props';
import { useDefineEmits } from './emits';
import type { TimelineEditorEmits } from './emits';
import { sortTimeLineByType } from './index';
defineOptions({
  name: 'TimeLine'
});
const props = defineProps(timeLineProps);
const emits = defineEmits<TimelineEditorEmits>();
const { provideTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const {
  showSideBar,
  sideBarWidth,
  editorData,
  actionEffects,
  background,
  rowSortTypes,
  hideCursor,
  fps,
  previewCursor
} = toRefs(props);
const {
  setShareProps,
  setShareEmits,
  setCursorTime,
  setCursorTimeByPos,
  enginePause,
  getEngine,
  enginePlay,
  getTimeLineDuration,
  scrollBy,
  scrollTo,
  setEngineState,
  setPreviewCursorState,
  getPreviewCursorState,
  getCursorTime,
  getInteractState,
  getEngineState
} = useTimeLineStore();
const { setSharePropsToScale, zoomFit, zoomIn, zoomOut, getFrameWidth, getScaleUnit } = useTimeLineScaleStore();
const shareEmits = useDefineEmits(emits);
const timeLineContainerRef = ref<HTMLElement>();
const timeLineEditorAreaContext = provideTimeLineEditorAreaContext();
const isMousedown = ref(false);
const isMouseup = ref(false);
// 注册辅助线
useActionGuideLine();
const handlerMouseDown = () => {
  isMousedown.value = true;
};
const handlerMouseUp = () => {
  isMouseup.value = true;
};
// 点击事件
const handleClick = (event: MouseEvent) => {
  if (isMousedown.value && isMouseup.value) {
    if (getPreviewCursorState.state && getEngineState.isPaused) {
      enginePause();
      setCursorTime(getPreviewCursorState.time);
    } else {
      enginePause();
      const curTime = setCursorTimeByPos(event.clientX, getScaleUnit.value, getFrameWidth.value);
      previewCursor.value && setPreviewCursorState({ time: curTime });
    }
    timeLineEditorAreaContext.clearSelected();
  }
  isMousedown.value = false;
  isMouseup.value = false;
};
// 滚轮事件
const handleEmitterLayerWheel = (event: WheelEvent) => {
  event.preventDefault();
  const deltaX = event.deltaX;
  const deltaY = event.deltaY;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    nextTick(() => {
      scrollBy({
        left: deltaX
      });
    });
  } else {
    nextTick(() => {
      scrollBy({
        top: deltaY
      });
    });
  }
};
// 鼠标移入事件
const handleMouseEnter = () => {
  if (!getInteractState.active) {
    setPreviewCursorState({ state: true });
  }
};
// 鼠标移出事件
const handleMouseLeave = () => {
  if (!getInteractState.active) {
    setPreviewCursorState({ state: false, time: unref(getCursorTime) }, false);
  }
};
// 重置渲染时间线
const resetRenderTimeLine = () => {
  unref(getEngine).pause();
  setCursorTime(0);
  zoomFit();
};
// watch(
//   [mainRow, mainRowId],
//   () => {
//     if (!mainRow.value) return;
//     if (mainRow.value && !mainRowId.value) {
//       consola.warn('mainRowId must be set');
//       return;
//     }
//     const findMainRow = Array.from(unref(editorData).filter(item => item.type === mainRowId?.value)).length;
//     if (findMainRow > 1) {
//       consola.warn('mainRowId must be unique');
//     }
//     if (findMainRow === 0) {
//       consola.warn('not find matched mainRowId in editorData');
//     }
//     timeLineStateContext.hasMainRow.value = findMainRow === 1;
//   },
//   { immediate: true }
// );
const sortEditorDataByRowSortTypes = () => {
  if (rowSortTypes?.value?.length && editorData?.value?.length) {
    const sortedEditorData = sortTimeLineByType(unref(editorData), unref(rowSortTypes)!);
    unref(editorData).splice(0, unref(editorData).length);
    unref(editorData).push(...sortedEditorData);
  }
};
watchArray(
  rowSortTypes,
  (newList, oldList) => {
    // // 主时间轴排序
    // if (mainRowId?.value) {
    //   const mainRowIds = unref(editorData).filter(item => item.type === mainRowId!.value);
    //   if (mainRowIds.length) {
    //     const mainRowIndex = unref(editorData).findIndex(item => item.type === mainRowId!.value);
    //     unref(editorData).push(unref(editorData)[mainRowIndex]);
    //     unref(editorData).splice(mainRowIndex, 1);
    //   }
    // }
    if (!isEqual(newList, oldList)) {
      sortEditorDataByRowSortTypes();
    }
  },
  {
    immediate: true
  }
);
watch(
  () => unref(editorData).length,
  () => {
    if (unref(editorData).length) {
      sortEditorDataByRowSortTypes();
    }
  }
);

watch(
  editorData,
  () => {
    timeLineEditorAreaContext.editorData.value = unref(editorData);
    unref(getEngine).data = editorData.value;
    unref(getEngine).resetRenderEngine();
  },
  { deep: true, immediate: true }
);
watch(
  () => actionEffects.value,
  () => {
    unref(getEngine).effects = actionEffects.value;
    unref(getEngine).resetRenderEngine();
  },
  { deep: true, immediate: true }
);
watchEffect(() => {
  shareEmits.onTimeLineDurationChange(unref(getTimeLineDuration));
});
watch(fps, () => {
  resetRenderTimeLine();
});
const handlerPlay = () => {
  setEngineState({
    isPlaying: true,
    isPaused: false
  });
};
const handlerPause = () => {
  setEngineState({
    isPlaying: false,
    isPaused: true
  });
};
const handlerSetTimeByTick = ({ time }) => {
  let left = time / unref(getScaleUnit);
  left -= left % unref(getFrameWidth);
  const curTime = Math.round(left * unref(getScaleUnit));
  setCursorTime(curTime, false);
};
onMounted(() => {
  setShareProps(props);
  setSharePropsToScale(props);
  setShareEmits(shareEmits);
  unref(getEngine).on('play', handlerPlay);
  unref(getEngine).on('paused', handlerPause);
  unref(getEngine).on('setTimeByTick', handlerSetTimeByTick);
});
onBeforeUnmount(() => {
  enginePause();
  unref(getEngine).off('play', handlerPlay);
  unref(getEngine).off('paused', handlerPause);
  unref(getEngine).off('setTimeByTick', handlerSetTimeByTick);
  resetRenderTimeLine();
});
defineExpose<TimelineExpose>({
  get targetEl() {
    return timeLineContainerRef.value!;
  },
  get listener() {
    return unref(getEngine);
  },
  get isPlaying() {
    return unref(getEngine).isPlaying;
  },
  get isPaused() {
    return unref(getEngine).isPaused;
  },
  setPlayRate: unref(getEngine).setPlayRate.bind(unref(getEngine)),
  getPlayRate: unref(getEngine).getPlayRate.bind(unref(getEngine)),
  resetRenderEngine: unref(getEngine).resetRenderEngine.bind(unref(getEngine)),
  setTime: time => {
    setCursorTime(time);
  },
  getTime: unref(getEngine).getTime.bind(unref(getEngine)),
  play: (param?: Parameters<TimelineExpose['play']>[0]): boolean => {
    return enginePlay({ ...param });
  },
  pause: enginePause.bind(unref(getEngine)),
  scrollTo,
  resetRenderTimeLine,
  zoomFit: () => {
    zoomFit();
    nextTick(() => {
      scrollTo({ left: 0, behavior: 'smooth' });
    });
  },
  zoomIn,
  zoomOut
});
</script>
<style lang="scss" scoped>
.timeLine-container {
  background-color: v-bind('background');
  width: 100%;
  height: 100%;
  user-select: none;
  touch-action: none;
  position: relative;
  .timeLine-inner-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    .timeLine-divider {
      height: 100%;
      width: 1px;
    }

    .timeLine-editor-emitter-layer {
      height: 100%;
      overflow: hidden;
      .timeLine-editor-wrap {
        position: relative;
        height: 100%;
        width: 100%;
        z-index: auto;
      }
    }
  }
}
</style>
