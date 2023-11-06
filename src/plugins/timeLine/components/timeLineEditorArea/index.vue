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
  >
    <div
      ref="timeLineInnerRef"
      :class="{
        'pos-center': !isScroll
      }"
      class="w1820px"
    >
      <div
        v-for="(item, index) in editorData"
        :key="item.id"
        class="bg-#000"
        :style="{
          height: item?.rowHeight ? item.rowHeight + 'px' : rowHeight + 'px',
          // q:奇数项为红色，偶数项为绿色
          backgroundColor: index % 2 === 0 ? 'pink' : 'green'
        }"
      >
        <div class="flex-col">
          <span>{{ item.name }}</span>
          <span>{{ !isScroll }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventListener, useResizeObserver } from '@vueuse/core';
import { useTimeLineContext } from '../../contexts';
interface Props {
  onScroll?: (e: Event) => void;
}
const props = defineProps<Props>();
const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { timeAreaHeight, editorData, rowHeight } = toRefs(timeLineContext);
const timeLineRef = ref<HTMLElement>();
const timeLineInnerRef = ref<HTMLElement>();
const isScroll = ref<boolean>(false);
useEventListener(timeLineRef, 'scroll', e => {
  props.onScroll && props.onScroll(e);
});
useResizeObserver([timeLineRef, timeLineInnerRef], () => {
  console.log();
  isScroll.value = timeLineInnerRef.value!.scrollHeight >= timeLineRef.value!.clientHeight;
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
  .pos-center {
    position: relative;
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>
