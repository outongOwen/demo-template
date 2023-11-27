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
      height: `calc(100% - ${timeAreaHeight}px )`
    }"
    :class="{
      'pos-center': !isOutRange
    }"
    @click.stop="handleClick"
  >
    <div
      v-if="editorData.length"
      ref="timeLineInnerRef"
      class="timeLine-editor-area-inner"
      :style="{ rowGap: rowSpacing + 'px' }"
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
  </div>
</template>

<script setup lang="ts">
import { toReactive, useEventListener, useResizeObserver } from '@vueuse/core';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
import { useMainRow } from '../../hooks';
import type { TimelineRow } from '../../types';
import TimeLineRow from './timeLineRow/index.vue';
import BlankPlaceholder from './blankPlaceholder/index.vue';
interface Props {
  onScroll?: (e: Event) => void;
}
defineOptions({
  name: 'TimeLineEditorArea'
});
const props = defineProps<Props>();
const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineStateContext = injectTimeLineStateContext();
const { timeAreaHeight, editorData, rowSpacing, mainRowId } = toReactive(timeLineContext);
const { hasMainRow } = toRefs(timeLineStateContext);
const timeLineRef = ref<HTMLElement>();
const timeLineInnerRef = ref<HTMLElement>();
const minRowRef = ref<HTMLElement>();
const isOutRange = ref(false);
const getMinRowRef = (rowRef: InstanceType<typeof TimeLineRow>, rowItem: TimelineRow) => {
  if (rowRef?.rowRef && unref(hasMainRow) && rowItem.type === mainRowId) {
    rowRef.rowRef.id = 'timeLine-main-row';
    minRowRef.value = rowRef.rowRef;
  }
};
watchEffect(() => {
  console.log(timeLineContext, 'timeLineContexttimeLineContexttimeLineContext');
});
const { checkMainRowBottom } = useMainRow(minRowRef);

useEventListener(timeLineRef, 'scroll', e => {
  props.onScroll && props.onScroll(e);
});

useResizeObserver([timeLineRef, timeLineInnerRef], () => {
  if (timeLineRef.value && timeLineInnerRef.value) {
    isOutRange.value = timeLineRef.value!.offsetHeight <= timeLineInnerRef.value!.offsetHeight;
    checkMainRowBottom();
  }
});
// 动态计算row最大宽度
watch(
  () => editorData,
  () => {
    nextTick(() => {
      if (timeLineInnerRef.value) {
        const maxRowWidth = editorData.reduce((prev, cur) => {
          // 通过actions中最大end值计算最大宽度
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const maxEnd = cur.actions.reduce((prev: any, cur: any) => {
            return Math.max(prev, cur.end);
          }, 0);
          return Math.max(prev, maxEnd * 100);
        }, 0);
        timeLineInnerRef.value.style.width = `${maxRowWidth}px`;
      }
    });
  },
  {
    immediate: true
  }
);
const handleClick = () => {
  console.log('点击外部');
  timeLineStateContext.setSelectedActionId(['1', '12222']);
};
onMounted(() => {
  // 动态计算滚动条尺寸
  timeLineStateContext.scrollBarSize = timeLineRef.value!.offsetHeight - timeLineRef.value!.clientHeight;
  timeLineStateContext.timeLineEditorRef = timeLineRef.value;
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
