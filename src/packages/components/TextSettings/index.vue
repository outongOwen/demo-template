<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * index.vue
-->
<template>
  <div class="container">
    <n-input v-model:value="value" type="textarea" placeholder="基本的 Textarea" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TextSettings' });
const value = ref('');
</script>

<style scoped></style>
