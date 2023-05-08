<template>
  <div ref="materialContainerRef" class="flex-col wh-full py-10px">
    <header v-if="showHeader" ref="materialHeaderRef" class="flex-col px10px">
      <slot name="second-menu"></slot>
      <slot name="search-form"></slot>
    </header>
    <div class="pl10px" :style="{ height: `${materialBodyHeight}px` }">
      <slot
        name="material-body"
        :material-body-size="{
          width: materialContainerWidth,
          height: materialBodyHeight
        }"
      ></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
defineOptions({ name: 'GlobalMaterial' });
interface Props {
  showHeader: boolean | undefined;
}
defineProps<Props>();
const materialContainerRef = ref<HTMLElement | null>(null);
const materialHeaderRef = ref<HTMLElement | null>(null);
const { height: materialContainerHeight } = useElementSize(materialContainerRef);
const { height: materialHeaderHeight, width: materialContainerWidth } = useElementSize(materialHeaderRef);
const materialBodyHeight = computed(() => {
  if (materialHeaderHeight.value) {
    return materialContainerHeight.value - materialHeaderHeight.value;
  }
  return materialContainerHeight.value;
});
</script>

<style scoped></style>
