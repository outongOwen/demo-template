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
      'pos-center': !isOutRange
    }"
    @click.stop="handleClick"
  >
    {{ dragLineData }}
    <div
      v-if="editorData?.length"
      ref="timeLineInnerRef"
      class="timeLine-editor-area-inner"
      :style="{ rowGap: rowSpacing + 'px', width: timeLineInnerWidth + 'px' }"
    >
      <TimeLineRow
        v-for="item in editorData"
        :ref="el => getMinRowRef(el as InstanceType<typeof TimeLineRow>, item)"
        :key="item.id"
        :row-item="item"
      />
    </div>
    <slot v-else name="blankPlaceholder">
      <blank-placeholder />
    </slot>
    <!-- 时间线row辅助线 -->
    <div
      v-show="rowLinePosition.isMoving && rowLinePosition.y >= 0"
      class="drag-row-line"
      :style="{
        top: `${rowLinePosition.y}px`
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { toReactive, useResizeObserver, useElementSize } from '@vueuse/core';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
import { useMainRow, useGuideLine } from '../../hooks';
import type { TimelineRow } from '../../types';
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
const { scaleHeight, editorData, rowSpacing, mainRowId, leftOffset } = toReactive(timeLineContext);
const { hasMainRow, rowLinePosition, scaleUnit } = timeLineStateContext;
const timeLineRef = ref<HTMLElement>();
const timeLineInnerRef = ref<HTMLElement>();
const minRowRef = ref<HTMLElement | null>();
const isOutRange = ref(false);
const getMinRowRef = (rowRef: InstanceType<typeof TimeLineRow>, rowItem: TimelineRow) => {
  if (rowRef?.rowRef && unref(hasMainRow) && rowItem.type === mainRowId) {
    rowRef.rowRef.id = 'timeLine-main-row';
    minRowRef.value = rowRef.rowRef;
    return;
  }
  minRowRef.value = null;
};

const { checkMainRowBottom } = useMainRow(minRowRef);

useResizeObserver([timeLineRef, timeLineInnerRef], () => {
  if (timeLineRef.value && timeLineInnerRef.value) {
    isOutRange.value = timeLineRef.value!.offsetHeight <= timeLineInnerRef.value!.offsetHeight;
    checkMainRowBottom();
  }
});
const { width: timeLineRefWidth } = useElementSize(timeLineRef);
const maxEndTime = computed(() => {
  if (unref(editorData)) {
    const maxEnd = unref(editorData)!.reduce((prev, cur) => {
      // 通过actions中最大end值计算最大宽度
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const maxEnd = cur.actions.reduce((prev: any, cur: any) => {
        return Math.max(prev, cur.end);
      }, 0);
      return Math.max(prev, maxEnd);
    }, 0);
    return maxEnd;
  }
  return 0;
});
const timeLineInnerWidth = computed(() => {
  return unref(maxEndTime) / unref(scaleUnit) + unref(timeLineRefWidth) * 0.3 >= unref(timeLineRefWidth)
    ? unref(maxEndTime) / unref(scaleUnit) + unref(timeLineRefWidth) * 0.3
    : unref(timeLineRefWidth);
});
const handleClick = () => {
  console.log('点击外部');
  // timeLineStateContext.setSelectedActionId(['1', '12222']);
};
// 注册辅助线
const { dragLineData } = useGuideLine();

onMounted(() => {
  timeLineStateContext.timeLineEditorRef.value = timeLineRef.value;
  console.log(timeLineRefWidth.value, '_+_+');
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
  .drag-row-line {
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #fff;
    pointer-events: none;
    z-index: 9009;
  }
  // 禁止选中
  user-select: none;
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
