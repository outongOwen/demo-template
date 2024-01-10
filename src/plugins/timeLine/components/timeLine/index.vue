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
      <TimeLineSideBar v-if="showSideBar" />
      <div
        ref="timelineEditorWrapRef"
        class="timeLine-editor-wrap"
        :style="{
          width: showSideBar ? `calc(100% - ${sideBarWidth}px)` : '100%'
        }"
        @click="handleWrapClick($event)"
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
      >
        <TimeLineTimeArea />
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
import { consola } from 'consola';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
import TimeLineTimeArea from '../timeLineTimeArea/index.vue';
import TimeLineEditorArea from '../timeLineEditorArea/index.vue';
import TimeLineCursor from '../timeLineCursor/index.vue';
import TimeLineSideBar from '../timeLineSideBar/index.vue';
import type { TimelineAction, TimelineExpose } from '../../types';
import { useActionGuideLine } from '../../hooks';
import { timeLineProps } from './props';
import { sortTimeLineByType } from './index';
defineOptions({
  name: 'TimeLine'
});
const props = defineProps(timeLineProps);
const { provideTimeLineContext } = useTimeLineContext();
const { provideTimeLineStateContext } = useTimeLineStateContext();
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
  leftOffset
} = toRefs(props);
provideTimeLineContext(props);
const timelineEditorWrapRef = ref<HTMLElement | null>();
const mouseDown = ref(false);
const mouseUp = ref(false);
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
// 注册辅助线
useActionGuideLine();
const handleMouseDown = () => {
  mouseDown.value = true;
};
const handleMouseUp = () => {
  mouseUp.value = true;
};
const handleWrapClick = e => {
  if (mouseDown.value && mouseUp.value) {
    const excude = ['timeLine-editor-action', 'left-handle', 'right-handle']; // 过滤轨道中不触发的dom类名
    if (excude.indexOf(e.target.className) === -1) {
      const left = e.clientX - timelineEditorWrapRef.value!.getBoundingClientRect().x - leftOffset.value; // 点击的位置距离刻度0的距离
      const frameMs = 1000 / fps.value; // 轨道帧率，一帧多少ms.
      let time = (left + timeLineStateContext.scrollInfo.x.value) * timeLineStateContext.scaleUnit.value; // 得到点击坐标对应的时间
      time = time < 0 ? 0 : time;
      time =
        time > timeLineStateContext.timeLineMaxEndTime.value ? timeLineStateContext.timeLineMaxEndTime.value : time; //  限制0-duration;
      time = Math.round(time / frameMs) * frameMs; // 对时间进行帧级对齐
      timeLineStateContext.handleSetCursor(time); // seek时间
    }
  }
  mouseDown.value = false;
  mouseUp.value = false;
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
watchEffect(() => {
  timeLineStateContext.engineRef.value.effects = actionEffects.value;
});
watchEffect(() => {
  timeLineStateContext.engineRef.value.data = editorData.value;
  unref(timeLineStateContext.engineRef).reRender();
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
defineExpose<TimelineExpose>({
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
  play: (param: Parameters<TimelineExpose['play']>[0]) => unref(timeLineStateContext.engineRef).play({ ...param }),
  pause: unref(timeLineStateContext.engineRef).pause.bind(unref(timeLineStateContext.engineRef))
});
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
