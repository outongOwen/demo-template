<!--
 * new page
 * @author: outong
 * @since: 2022-08-30
 * functionScrollbar.vue
-->
<template>
  <div ref="scrollbarContainerRef" class="wh-full">
    <n-scrollbar
      ref="scrollbarRef"
      :style="$attrs.style"
      :class="$attrs.class"
      :trigger="trigger"
      :x-scrollable="xScrollable"
    >
      <slot></slot>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { NScrollbar } from 'naive-ui';
import { useScroll, useEventListener } from '@vueuse/core';
defineOptions({ name: 'BetterScrollBar' });
interface ExposAPI {
  scrollToBottom: () => void;
  scrollTo: (options: { left?: number; top?: number; behavior?: ScrollBehavior }) => void;
  scrollBy: (options: { left?: number; top?: number; behavior?: ScrollBehavior }) => void;
  scrollOptions: ScrollReturnOption;
  isScrollbarX: Ref<boolean>;
  isScrollbarY: Ref<boolean>;
}
interface ArrivedState {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}
export interface ScrollReturnOption {
  x: Ref<number>;
  y: Ref<number>;
  isScrolling: Ref<boolean>;
  arrivedState: ArrivedState;
  directions: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}
export type ScrollInst = ExposAPI;
interface Emits {
  (e: 'scroll', event: Event, scrollOptions: ScrollReturnOption): void;
}
interface Props {
  trigger?: 'hover' | 'none';
  xScrollable?: boolean;
  isShowScrollBar?: boolean;
}
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  trigger: 'none',
  xScrollable: false,
  isShowScrollBar: true
});
const { isShowScrollBar } = toRefs(props);
const scrollbarRef = ref<InstanceType<typeof NScrollbar> | null>(null);
const scrollbarContainerRef = ref<HTMLElement | null>();
const scrollOptions = useScroll(scrollbarContainerRef);
const isScrollbarX = ref<boolean>(false);
const isScrollbarY = ref<boolean>(false);
nextTick(() => {
  scrollbarContainerRef.value = unref(scrollbarRef)!.scrollbarInstRef!.containerRef;
});
const scrollTo = (options: { left?: number; top?: number; behavior?: ScrollBehavior }): void => {
  unref(scrollbarRef)?.scrollTo(options);
};
const scrollBy = (options: { top?: number; left?: number; behavior?: ScrollBehavior }): void => {
  unref(scrollbarRef)?.scrollBy(options);
};
const scrollToBottom = (): void => {
  scrollTo({ left: 0, top: unref(scrollbarContainerRef)?.scrollHeight, behavior: 'smooth' });
};
const cleanup = useEventListener(
  scrollbarContainerRef,
  'scroll',
  (e: Event) => {
    emit('scroll', e, scrollOptions);
  },
  { passive: true }
);
onMounted(() => {
  const { scrollHeight, clientHeight, scrollWidth, clientWidth } = unref(scrollbarRef)!.scrollbarInstRef!.containerRef!;
  isScrollbarY.value = scrollHeight > clientHeight;
  isScrollbarX.value = scrollWidth > clientWidth;
});
onBeforeUnmount(() => {
  cleanup();
});
defineExpose<ExposAPI>({
  scrollToBottom,
  scrollTo,
  scrollBy,
  scrollOptions,
  isScrollbarX,
  isScrollbarY
});
</script>

<style scoped lang="scss">
:deep(.n-scrollbar-rail) {
  display: v-bind("isShowScrollBar?'block':'none'");
  @apply : rounded-0 important-right-0 important-bottom-0 important-top-0;
  .n-scrollbar-rail__scrollbar {
    @apply important-rounded-0 z9;
  }
}
</style>
