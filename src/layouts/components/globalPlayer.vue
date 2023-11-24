<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * globalCanvas.vue
-->
<template>
  <div ref="playerContainerRef" class="wh-full flex flex-col px9px pt9px pb15px" :style="fullscreenStyle">
    <div class="w-full h-[calc(100%-78px)]">
      <slot name="canvas" />
    </div>
    <div class="w-full flex-1 pt4px box-border">
      <slot name="controls" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayerStore, useThemeStore } from '@/store';
import { useCssFullscreen } from '@/hooks';
defineOptions({ name: 'PlayerLayout' });
const playerStore = usePlayerStore();
const themeStore = useThemeStore();
const { getIsFullscreenState } = storeToRefs(playerStore);
const { darkMode } = storeToRefs(themeStore);
const playerContainerRef = ref<HTMLElement>();
const { enter: enterCssFullscreen, exit: exitCssFullscreen, isFullscreen } = useCssFullscreen(playerContainerRef);
const fullscreenStyle = computed((): StyleValue => {
  return getIsFullscreenState.value
    ? {
        width: '100%',
        height: '100%',
        minWidth: '500px',
        minHeight: '500px',
        backgroundColor: darkMode.value ? '#282828' : '#fff'
      }
    : {};
});
watch(getIsFullscreenState, state => {
  state ? enterCssFullscreen() : exitCssFullscreen();
});
watchEffect(() => {
  playerStore.setFullscreenState(isFullscreen.value);
});
</script>

<style scoped></style>
