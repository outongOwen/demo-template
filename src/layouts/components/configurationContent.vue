<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-16
 * configLayout.vue
-->
<template>
  <div class="wh-full">
    <div class="px10px">
      <slot name="topBtn" />
    </div>
    <div class="py10px">
      <n-divider class="my0px!" />
    </div>
    <div class="wh-full pl10px pr10px">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigurationAreaLayout' });
</script>

<style scoped></style>
