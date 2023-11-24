<template>
  <div class="relative flex-center p-x-15px h-full" :style="[`minWidth:${theme.header.minWidth}px`]">
    <div class="flex items-center wh-full">
      <slot name="left"></slot>
    </div>
    <div class="flex-center wh-full">
      <slot name="center"></slot>
    </div>
    <div class="flex items-center justify-end wh-full">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store';
const theme = useThemeStore();
defineOptions({
  name: 'HeaderLayout'
});
</script>

<style scoped></style>
