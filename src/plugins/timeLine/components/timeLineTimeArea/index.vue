<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->
<template>
  <div class="w100% color-#fff pr-8px" :style="{ height: timeAreaHeight + 'px' }">
    <div class="wh-full bg-#000">{{ timeAreaHeight }}</div>
  </div>
</template>

<script setup lang="ts">
import { useTimeLineContext } from '../../contexts';
// const props = defineProps({
//   // 传入的参数
// });
const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { timeAreaHeight } = toRefs(timeLineContext);
</script>

<style scoped></style>
