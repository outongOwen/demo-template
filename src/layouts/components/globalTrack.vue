<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * globalTrack.vue
-->
<template>
  <div class="wh-full">
    <div class="px-10px h50px">
      <slot name="trackActionBar" />
    </div>

    <n-divider class="my-0!" />
    <div class="w-full flex-center h-[calc(100%-51px)]">
      <div class="w130px h100%">
        <slot name="trackLeftBar" />
      </div>
      <n-divider vertical class="h100%! mx0!" />
      <div class="h-full w-[calc(100%-130px)]">
        <slot name="trackContent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TrackLayout' });
</script>

<style scoped></style>
