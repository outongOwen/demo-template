<!--
 * @abstract:播放器
 * @author: owenTong
 * @since: 2023-06-01
 * index.vue
-->
<template>
  <global-player>
    <template #canvas>
      <Canvas />
    </template>
    <template #controls>
      <Controls />
    </template>
  </global-player>
</template>

<script setup lang="ts">
import { GlobalPlayer } from '@/layouts';
import Canvas from './components/canvas/index.vue';
import Controls from './components/controls/index.vue';
</script>

<style scoped></style>
