<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-06
 * imageItem.vue
-->
<template>
  <div
    :style="{ height: item.height + 'px' }"
    class="flex-center! h-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.3)] relative"
  >
    <n-image
      :src="item.injected.preUrl"
      :preview-src="item.injected.path"
      :lazy="lazy"
      fallback-src=""
      object-fit="contain"
      :intersection-observer-options="intersectionObserverOptions"
    >
      <template #placeholder>
        <n-skeleton class="wh-full" />
      </template>
    </n-image>
    <div class="absolute-bl left-0 right-0 bg-[rgba(255,255,255,.1)] text-center">
      <n-text class="w100% px10px break-words line-clamp-1">
        {{ item.injected.duration }}
      </n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IntersectionObserverOptions {
  root?: Element | Document | null | string;
  rootMargin?: string;
  threshold?: number | number[];
}
interface Props {
  item: {
    id: string;
    injected: Record<string, any>;
    height: number;
    width: number;
    columnSpan: number;
  };
  intersectionObserverOptions?: IntersectionObserverOptions;
  lazy?: boolean;
}
const props = defineProps<Props>();
const { item, intersectionObserverOptions } = toRefs(props);
</script>

<style scoped lang="scss">
:deep(.n-image) {
  @apply wh-full;
  > img {
    @apply wh-full;
  }
}
</style>
