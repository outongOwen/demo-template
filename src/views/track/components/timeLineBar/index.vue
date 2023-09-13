<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-25
 * index.vue
-->
<template>
  <div ref="trackBarRef" class="h1080px" :style="{ transform: `translateY(-${scrollY}px)` }">
    <n-list>
      <n-list-item v-for="item in 24" :key="item">{{ `测试${item}` }}</n-list-item>
    </n-list>
  </div>
</template>
<script lang="ts">
export default {
  name: 'TimeLineBar'
};
</script>
<script setup lang="ts">
import { ref, toRefs } from 'vue';
interface Props {
  scrollY: number;
}
const props = defineProps<Props>();
const trackBarRef = ref<HTMLElement | null>(null);
const { scrollY } = toRefs(props);
</script>

<style scoped></style>
