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
      top: `${getShareProps.scaleHeight}px`
    }"
    @contextmenu.stop="handleContextMenu"
  >
    <div
      v-if="getTimeLineEditorData?.length"
      ref="timeLineInnerRef"
      class="timeLine-editor-area-wrapper"
      :style="{
        left: `${getShareProps.leftOffset}px`
      }"
    >
      <div
        class="timeLine-editor-area-inner"
        :style="{ width: timeLineInnerWidth + 'px', rowGap: getShareProps.rowSpacing + 'px' }"
      >
        <TimeLineRow v-for="item in getTimeLineEditorData" :key="item.id" :row-item="item" />
      </div>
    </div>
    <!-- <blank-placeholder v-else /> -->
    <DragGuideLine />
  </div>
</template>

<script setup lang="ts">
import { useTimeLineStore, useTimeLineScaleStore } from '../../store';
import DragGuideLine from './dragGuideLine/index.vue';
import TimeLineRow from './timeLineRow/index.vue';
// import BlankPlaceholder from './blankPlaceholder/index.vue';
defineOptions({
  name: 'TimeLineClipArea'
});
const timeLineRef = ref<HTMLElement>();
const timeLineInnerRef = ref<HTMLElement>();
const {
  setTimeLineClipDomRef,
  getShareProps,
  getTimeLineEditorData,
  getScaleUnit,
  getTimeLineMaxEndTime,
  getTimeLineClipDomSize
} = useTimeLineStore();
const { setTimeLineClipDomRefToScale, setTimeLineClipInnerSize } = useTimeLineScaleStore();
const timeLineInnerWidth = computed(() => {
  return (
    unref(getTimeLineClipDomSize.width) +
    unref(getTimeLineMaxEndTime) / unref(getScaleUnit) -
    unref(getTimeLineClipDomSize.width) / 4
  );
});
watchEffect(() => {
  setTimeLineClipInnerSize({
    width: timeLineInnerWidth.value,
    height: unref(getTimeLineClipDomSize.height)
  });
});
// 右键菜单
const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault();
};

onMounted(() => {
  setTimeLineClipDomRef(timeLineRef.value);
  setTimeLineClipDomRefToScale(timeLineRef.value!);
});
</script>

<style scoped lang="scss">
@mixin timeLineScrollbar($color: rgba(255, 255, 255, 0.2), $hover: rgba(255, 255, 255, 0.3), $size: 10px) {
  &::-webkit-scrollbar-thumb {
    background-color: $color;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: $hover;
  }
  &::-webkit-scrollbar {
    width: $size;
    height: $size;
  }
  &::-webkit-scrollbar-track-piece {
    border-radius: 0;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
}
#__TIME_LINE_SCROLL_EL_BAR__ {
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
