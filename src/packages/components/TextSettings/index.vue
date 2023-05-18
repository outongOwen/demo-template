<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-17
 * index.vue
-->
<template>
  <div class="container">
    <n-input v-model:value="textModelValue" type="textarea" placeholder="基本的 Textarea" />
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
defineOptions({ name: 'TextSettings' });
interface Props {
  text: string;
}
interface Emits {
  (event: 'update:text', value: string): void;
}
const emit = defineEmits<Emits>();
const props = defineProps<Props>();
const textModelValue = useVModel(props, 'text', emit);
</script>

<style scoped></style>
