<template>
  <div ref="materialContainerRef" class="flex-col wh-full">
    <header v-if="showHeader" ref="materialHeaderRef" class="flex-col px10px">
      <div class="pb10px">
        <slot name="second-menu"></slot>
      </div>
      <div class="pb5px">
        <slot name="search-form"></slot>
      </div>
    </header>
    <div class="pl10px py10px">
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
    return materialContainerHeight.value - materialHeaderHeight.value - 20;
  }
  return materialContainerHeight.value - 20;
});
</script>

<style scoped></style>
