<template>
  <div
    ref="blankPlaceholderRef"
    class="blank-placeholder-container"
    :style="{
      paddingLeft: `${leftOffset}px`,
      rowGap: `${rowSpacing}px`
    }"
  >
    <!-- <div class="top-cover">
      {{ '可从侧边栏添加包装效果及素材到这里' }}
    </div>
    <div class="center-box">{{ '直接拖放侧边栏媒体素材到这里' }}</div>
    <div class="bottom-cover">{{ '可从侧边栏添加在线音频到这里' }}</div> -->
    <div class="blank-placeholder-container-inner">
      {{ '直接拖放侧边栏媒体素材到这里' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { toReactive } from '@vueuse/core';
import { useTimeLineContext } from '../../../contexts';
const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { rowHeight, rowSpacing, rowBackground, rowActiveBackground, leftOffset } = toReactive(timeLineContext);
const blankPlaceholderRef = ref<HTMLElement>();
</script>

<style scoped lang="scss">
.blank-placeholder-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  .blank-placeholder-container-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    overflow: hidden;
    color: #f5f5f5;
    &:hover {
      background-color: v-bind('rowActiveBackground');
    }
  }

  .top-cover {
    flex: 1;
  }
  .center-box {
    height: v-bind("rowHeight + 'px'");
    flex-shrink: 0;
    background-color: v-bind('rowBackground');
  }
  .bottom-cover {
    flex: 1;
  }
  .top-cover,
  .bottom-cover,
  .center-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 5px;
    transition: border-color 0.3s ease; /* 添加过渡效果 */
  }
  .top-cover:hover,
  .bottom-cover:hover,
  .center-box:hover {
    background-color: v-bind('rowActiveBackground');
  }
}
</style>
