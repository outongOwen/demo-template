<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->
<template>
  <div
    id="__TIME_LINE_SCROLL_EL_BAR__"
    ref="timeLineRef"
    class="timeLine-editor-area-container"
    :style="{
      height: `calc(100% - ${scaleHeight}px )`,
      paddingLeft: `${leftOffset}px`
    }"
    :class="{
      'pos-center': !hasShowScroll
    }"
    @click.stop="handleClick"
  >
    <div
      v-if="editorData?.length"
      ref="timeLineInnerRef"
      class="timeLine-editor-area-inner"
      :style="{ rowGap: rowSpacing + 'px', width: timeLineInnerWidth + 'px' }"
    >
      <!-- {{ dragLineActionLine }} -->
      <TimeLineRow v-for="item in editorData" :key="item.id" :row-item="item" />
    </div>
    <slot v-else name="blankPlaceholder">
      <blank-placeholder />
    </slot>
    <div
      v-show="timeLineEditorAreaContext.dropzoneInfo.isMoving"
      class="drag-row-line"
      :style="{
        top: `${timeLineEditorAreaContext.dropzoneInfo.top}px`,
        left: `${scrollLeft}px`
      }"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable */
import { useResizeObserver, useElementSize, useScroll } from '@vueuse/core';
import { useTimeLineContext, useTimeLineStateContext, useTimeLineEditorAreaContext } from '../../contexts';
import { useActionGuideLine } from '../../hooks';
// import type { TimelineAction, TimelineRow } from '../../types';
import TimeLineRow from './timeLineRow/index.vue';
import BlankPlaceholder from './blankPlaceholder/index.vue';
defineOptions({
  name: 'TimeLineEditorArea'
});
// const props = defineProps<Props>();
const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineStateContext = injectTimeLineStateContext();
const { provideTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const { scaleHeight, editorData, rowSpacing, leftOffset } = toRefs(timeLineContext);
const { scaleUnit } = timeLineStateContext;
const timeLineRef = ref<HTMLElement>();
const timeLineInnerRef = ref<HTMLElement>();
// const minRowRef = ref<HTMLElement | null>();
// 滚动条出现
const hasShowScroll = ref(false);
const timeLineEditorAreaContext = provideTimeLineEditorAreaContext({
  editorData
});
useResizeObserver([timeLineRef, timeLineInnerRef], () => {
  if (timeLineRef.value && timeLineInnerRef.value) {
    hasShowScroll.value = timeLineRef.value!.offsetHeight <= timeLineInnerRef.value!.offsetHeight;
  }
});
const { x: scrollLeft } = useScroll(timeLineStateContext.timeLineEditorRef);
const { width: timeLineRefWidth } = useElementSize(timeLineRef);
const timeLineInnerWidth = computed(() => {
  return unref(timeLineStateContext.timeLineMaxEndTime) / unref(scaleUnit) + unref(timeLineRefWidth) * 0.3 >=
    unref(timeLineRefWidth)
    ? unref(timeLineStateContext.timeLineMaxEndTime) / unref(scaleUnit) + unref(timeLineRefWidth) * 0.3
    : unref(timeLineRefWidth);
});
const handleClick = () => {
  timeLineEditorAreaContext.clearSelected();
};
// 注册辅助线
const dragLineActionLine = useActionGuideLine();
onMounted(() => {
  timeLineStateContext.timeLineEditorRef.value = timeLineRef.value;
});
</script>

<style scoped lang="scss">
@mixin timeLineScrollbar($color: rgba(255, 255, 255, 0.2), $hover: rgba(255, 255, 255, 0.3), $size: 5px) {
  scrollbar-width: thin;
  scrollbar-color: $color transparent;
  &::-webkit-scrollbar-thumb {
    background-color: $color;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: $hover;
  }
  &::-webkit-scrollbar {
    width: $size;
    height: $size;
    // position: relative;
  }

  &::-webkit-scrollbar-track-piece {
    border-radius: 0;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}

#__TIME_LINE_SCROLL_EL_BAR__ {
  @include timeLineScrollbar(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3), 8px);
}

.dark #__TIME_LINE_SCROLL_EL_BAR__ {
  @include timeLineScrollbar(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3), 8px);
}
.timeLine-editor-area-container {
  width: 100%;
  overflow: scroll;
  position: relative;
  // 禁止选中
  user-select: none;
  .drag-row-line {
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #fff;
    pointer-events: none;
    z-index: 9999999;
  }

  .timeLine-editor-area-inner {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    padding-bottom: 20px;
    justify-content: flex-start;
  }
}
.pos-center {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
