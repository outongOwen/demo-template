<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->
<template>
  <div ref="testRef" class="w100% color-#fff pr-8px" :style="{ height: timeAreaHeight + 'px' }">
    <div class="wh-full">{{ timeAreaHeight }}</div>
  </div>
</template>

<script setup lang="ts">
import { toReactive } from '@vueuse/core';
import { useTimeLineContext } from '../../contexts';
// const props = defineProps({
//   // 传入的参数
// });
const testRef = ref<HTMLElement>();

const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { timeAreaHeight } = toReactive(timeLineContext);
</script>

<style scoped></style>
