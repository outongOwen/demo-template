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
          <TimeLineTimeArea />
          <TimeLineEditorArea />
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
import TimeLineTimeArea from '../timeLineTimeArea/index.vue';
import TimeLineEditorArea from '../timeLineEditorArea/index.vue';
import TimeLineCursor from '../timeLineCursor/index.vue';
import TimeLineSideBar from '../timeLineSideBar/index.vue';
import TimeLinePreviewCursor from '../timeLinePreviewCursor/index.vue';
import { useActionGuideLine } from '../../hooks';
import type { TimelineExpose } from '../../types';
import { useTimeLineStore } from '../../store';
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
const { showSideBar, sideBarWidth, editorData, actionEffects, background, rowSortTypes, hideCursor } = toRefs(props);
const {
  setTimeLineEditorData,
  setShareProps,
  setShareEmits,
  setCursorTime,
  setCursorTimeByPos,
  enginePause,
  getEngine,
  enginePlay,
  getTimeLineMaxEndTime,
  scrollBy,
  scrollTo,
  setEngineState,
  getFrameWidth,
  getScaleUnit,
  setPreviewCursorState,
  getPreviewCursorState,
  getCursorTime
} = useTimeLineStore();
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
  !isMousedown.value && setPreviewCursorState({ state: true });
};
// 点击事件
const handleClick = (event: MouseEvent) => {
  if (isMousedown.value && isMouseup.value) {
    enginePause();
    setCursorTimeByPos(event.clientX);
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
  setPreviewCursorState({ state: true });
};
// 鼠标移出事件
const handleMouseLeave = () => {
  setPreviewCursorState({ state: false });
  setCursorTime(unref(getCursorTime));
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
      if (rowSortTypes?.value?.length && editorData?.value?.length) {
        const sortedEditorData = sortTimeLineByType(unref(editorData), unref(rowSortTypes)!);
        unref(editorData).splice(0, unref(editorData).length);
        unref(editorData).push(...sortedEditorData);
      }
    }
  },
  {
    immediate: true
  }
);
watch(
  getTimeLineMaxEndTime,
  (time: number) => {
    shareEmits.onMaxEndTimeChange(time);
  },
  {
    immediate: true
  }
);
watch(
  editorData,
  () => {
    timeLineEditorAreaContext.editorData.value = unref(editorData);
    unref(getEngine).data = editorData.value;
    unref(getEngine).reRender();
  },
  { deep: true, immediate: true }
);
watch(
  () => actionEffects.value,
  () => {
    unref(getEngine).effects = actionEffects.value;
    unref(getEngine).reRender();
  },
  { deep: true, immediate: true }
);
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
  unref(getEngine).on('play', handlerPlay);
  unref(getEngine).on('paused', handlerPause);
  unref(getEngine).on('setTimeByTick', handlerSetTimeByTick);
  setShareProps(props);
  setShareEmits(shareEmits);
  setTimeLineEditorData(editorData.value);
});
onBeforeUnmount(() => {
  enginePause();
  unref(getEngine).off('play', handlerPlay);
  unref(getEngine).off('paused', handlerPause);
  unref(getEngine).off('setTimeByTick', handlerSetTimeByTick);
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
  reRender: unref(getEngine).reRender.bind(unref(getEngine)),
  setTime: time => {
    setCursorTime(time);
  },
  getTime: unref(getEngine).getTime.bind(unref(getEngine)),
  play: (param?: Parameters<TimelineExpose['play']>[0]): boolean => {
    return enginePlay({ ...param });
  },
  pause: enginePause.bind(unref(getEngine)),
  scrollTo
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
