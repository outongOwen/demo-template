<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-16
 * configLayout.vue
-->
<template>
  <div class="wh-full">
    <div ref="topBtnRef" class="px10px">
      <slot name="topBtn" />
    </div>
    <div ref="dividerRef" class="py10px">
      <n-divider class="my0px!" />
    </div>
    <div class="w-full" :style="{ height: `calc(100% - ${configAreaHeight}px)` }">
      <better-scroll-bar>
        <div class="wh-full pl10px pr10px">
          <slot />
        </div>
      </better-scroll-bar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize, useElementBounding } from '@vueuse/core';
defineOptions({ name: 'ConfigurationContentLayout' });
const topBtnRef = ref<HTMLElement | null>();
const dividerRef = ref<HTMLElement | null>();
const { height: topBtnHeight } = useElementSize(topBtnRef);
const { height: dividerHeight } = useElementBounding(dividerRef);
const configAreaHeight = computed((): number => {
  return topBtnHeight.value + dividerHeight.value;
});
watchEffect(() => {
  console.log(topBtnHeight.value, dividerHeight.value);
});
</script>

<style scoped></style>
