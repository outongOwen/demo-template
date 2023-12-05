<template>
  <n-space
    vertical
    :size="10"
    :wrap-item="false"
    align="center"
    class="blank-placeholder-container pl-10px wh-full of-hidden"
  >
    <n-space
      justify="center"
      class="top-cover flex-1 min-h-30px"
      @mouseenter="topCoverShow = true"
      @mouseleave="topCoverShow = false"
    >
      <icon-material-symbols:drive-file-move v-show="topCoverShow" class="text-20px" />
      <n-text v-show="topCoverShow">{{ '可从侧边栏添加包装效果及素材到这里' }}</n-text>
    </n-space>
    <n-space justify="center" class="center-box h80px shrink-0 bg-[rgba(50,50,50,1)]">
      <icon-material-symbols:add-box class="text-20px" />
      <n-text>{{ '直接拖放侧边栏媒体素材到这里' }}</n-text>
    </n-space>
    <n-space
      justify="center"
      class="bottom-cover flex-1 min-h-30px"
      @mouseenter="bottomCoverShow = true"
      @mouseleave="bottomCoverShow = false"
    >
      <icon-mdi:music-box v-show="bottomCoverShow" class="text-20px" />
      <n-text v-show="bottomCoverShow">{{ '可从侧边栏添加在线音频到这里' }}</n-text>
    </n-space>
  </n-space>
</template>

<script setup lang="ts">
const topCoverShow = ref(false);
const bottomCoverShow = ref(false);
</script>

<style scoped lang="scss">
.blank-placeholder-container {
  .top-cover,
  .bottom-cover,
  .center-box {
    @apply w100% flex-center of-hidden rounded-5px transition-colors-3 text-14px;
  }

  .top-cover:hover,
  .bottom-cover:hover,
  .center-box:hover {
    @apply bg-[rgba(70,70,70,1)] transition-all-3;
  }
}
</style>
