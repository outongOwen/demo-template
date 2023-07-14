<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-25
 * index.vue
-->
<template>
  <global-track>
    <template #trackActionBar>
      <track-action-bar />
    </template>
    <template #trackContainer>
      <track-container />
    </template>
  </global-track>
</template>

<script setup lang="ts">
import GlobalTrack from '@/layouts/components/globalTrack.vue';
import { TrackActionBar, TrackContainer } from './components';
</script>

<style scoped></style>
