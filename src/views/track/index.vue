<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-25
 * index.vue
-->
<template>
  <global-track>
    <template #trackActionBar>
      <TrackActionBar />
    </template>
    <template #trackLeftBar>
      <div>123213213</div>
    </template>
    <template #trackContent>
      <div class="wh-full">
        <BetterScrollBar x-scrollable>
          <div class="w1920 h1000px"></div>
        </BetterScrollBar>
      </div>
    </template>
  </global-track>
</template>

<script setup lang="ts">
import GlobalTrack from '@/layouts/components/globalTrack.vue';
import { TrackActionBar } from './components';
</script>

<style scoped></style>
