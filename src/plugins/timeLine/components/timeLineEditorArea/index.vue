<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->
<template>
  <div class="h-[calc(100%-42px)] w-full">
    <div id="__TRACK_SCROLL_EL_ID__" ref="trackScrollRef" class="of-scroll wh-full">
      <div class="w1920px h1080px relative">
        <!-- <div class="w100% h-auto">占位符上</div>
            <div class="h72px w100% bg-#000">主轨道</div>
            <div class="w100% h-auto">占位符下</div> -->
        <!-- <div class="fixed left-0 top-0">
          {{ scrollReturn.y }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
interface Props {
  onScroll: (e: Event) => void;
}
const props = defineProps<Props>();
const trackScrollRef = ref<HTMLElement>();
useEventListener(trackScrollRef, 'scroll', e => {
  // emit('scroll', e);
  props.onScroll(e);
});
</script>

<style scoped lang="scss">
#__TRACK_SCROLL_EL_ID__ {
  @include scrollbar(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3), 8px);
}

.dark #__TRACK_SCROLL_EL_ID__ {
  @include scrollbar(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3), 8px);
}
</style>
