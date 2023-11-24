<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * globalTrack.vue
-->
<template>
  <div class="wh-full">
    <div class="px-10px h49px">
      <slot name="trackActionBar" />
    </div>

    <n-divider class="my-0!" />
    <div class="w-full h-[calc(100%-50px)] of-hidden">
      <!-- <div class="w130px h100% mt42px">
        <slot name="trackBar" />
      </div> -->
      <!-- <n-divider vertical class="h100%! mx0!" /> -->
      <!-- <div class="h-full w-[calc(100%-130px)]">
        <slot name="trackContainer" />
      </div> -->
      <slot name="trackContainer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTrackContext } from '@/contexts';
defineOptions({ name: 'TrackLayout' });
const { provideTrackContext } = useTrackContext();
provideTrackContext({
  scrollTop: 42
});
</script>

<!-- <style scoped lang="scss">
.track-bar-wrap::after {
  @apply content-[''] absolute left-0 top-0 right-0 h42px bg-dark z1;
}
</style> -->
