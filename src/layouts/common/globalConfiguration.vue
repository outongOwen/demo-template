<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-11
 * globalConfiguraion.vue
-->
<template>
  <div ref="configurationContainerRef" class="absolute wh-full left-0 top-0 z99 dark:bg-dark bg-#fff">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'GlobalConfiguration' });
</script>

<style scoped></style>
