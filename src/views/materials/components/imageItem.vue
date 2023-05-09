<!--
 * new page
 * @author: owenTong
 * @since: 2023-05-06
 * imageItem.vue
-->
<template>
  <div
    :style="{ height: item.height + 'px' }"
    class="flex-center! wh-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.3)] relative"
  >
    <n-image
      :src="(item.injected.url as string) || '' "
      :lazy="lazy"
      fallback-src="https://raw.githubusercontent.com/outongOwen/picture_bed/main/image/202305040943089.png"
      object-fit="contain"
      :intersection-observer-options="intersectionObserverOptions"
    >
      <template #placeholder>
        <n-skeleton class="wh-full" />
      </template>
    </n-image>
    <div class="absolute-bl left-0 right-0 bg-[rgba(255,255,255,.3)] text-center">
      <n-text class="w100% px10px break-words line-clamp-4">
        {{ item.id }}
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
    injected: Record<string, unknown>;
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

<style scoped></style>
