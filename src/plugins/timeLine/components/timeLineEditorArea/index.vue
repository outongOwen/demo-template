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
      top: `${scaleHeight}px`
    }"
    @click="handleClick($event)"
    @mousedown="handleMousedown"
    @mouseup="handleMouseup"
  >
    <div
      v-if="editorData?.length"
      class="timeLine-editor-area-wrapper"
      :style="{
        left: `${leftOffset}px`
      }"
    >
      <div
        ref="timeLineInnerRef"
        class="timeLine-editor-area-inner"
        :style="{ width: timeLineInnerWidth + 'px', rowGap: rowSpacing + 'px' }"
      >
        <TimeLineRow v-for="item in editorData" :key="item.id" :row-item="item" />
      </div>
    </div>
    <blank-placeholder v-else />
    <DragGuideLine v-if="guideLine" />
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
// import type { TimelineAction, TimelineRow } from '../../types';
import { useActionGuideLine } from '../../hooks';
import DragGuideLine from './dragGuideLine/index.vue';
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
// const { injectTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const { scaleHeight, editorData, rowSpacing, leftOffset, guideLine } = toRefs(timeLineContext);
const { scaleUnit } = timeLineStateContext;
const timeLineRef = ref<HTMLElement>();
const mouseDown = ref(false);
const mouseUp = ref(false);
// const timeLineEditorAreaContext = injectTimeLineEditorAreaContext();
// const minRowRef = ref<HTMLElement | null>();
const { width: timeLineRefWidth } = useElementSize(timeLineRef);
const timeLineInnerWidth = computed(() => {
  return unref(timeLineStateContext.timeLineMaxEndTime) / unref(scaleUnit) + unref(timeLineRefWidth);
});
const handleClick = e => {
  if (mouseDown.value && mouseUp.value) {
    // console.log('取消选中', e);
    // timeLineEditorAreaContext.clearSelected();
  } else {
    e.preventDefault();
    e.stopPropagation();
  }
  mouseDown.value = false;
  mouseUp.value = false;
};
const handleMousedown = () => {
  console.log('是否点击');
  mouseDown.value = true;
};
const handleMouseup = () => {
  mouseUp.value = true;
};
// 注册辅助线
useActionGuideLine();

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
  align-items: flex-start;
  position: absolute;
  justify-content: flex-start;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: auto;
  .drag-row-line {
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #fff;
    pointer-events: none;
    z-index: 9999999;
  }
  .timeLine-editor-area-wrapper {
    align-items: stretch;
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    min-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    .timeLine-editor-area-inner {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 20px 0;
    }
  }
}
</style>
