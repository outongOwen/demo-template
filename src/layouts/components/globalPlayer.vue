<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * globalCanvas.vue
-->
<template>
  <div class="wh-full flex flex-col px9px pt9px pb15px">
    <div class="w-full h-[calc(100%-78px)]">
      <slot name="canvas" />
    </div>
    <div class="w-full h78px pt4px box-border">
      <slot name="controls" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'CanvasLayout' });
</script>

<style scoped></style>
