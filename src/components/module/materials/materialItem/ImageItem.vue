<!--
 * @abstract:图片素材列表项
 * @author: owenTong
 * @since: 2023-05-06
 * imageItem.vue
-->
<template>
  <div :style="{ height: item.height + 'px', width: item.width + 'px' }">
    <div
      class="w-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.3)] h-[calc(100%-20px)] flex-center"
      @click="emits('preview', item)"
    >
      <n-image
        :height="item.height - 20"
        :width="item.width"
        :src="item.injected.preUrl"
        :preview-src="item.injected.path"
        fallback-src=""
        object-fit="contain"
        preview-disabled
      >
        <template #placeholder>
          <n-skeleton class="w-full h-[calc(100%-20px)]" />
        </template>
      </n-image>
    </div>
    <n-text>
      <n-ellipsis class="w100% h20px">
        {{ item.injected.name }}
      </n-ellipsis>
    </n-text>
  </div>
</template>

<script setup lang="ts">
// interface IntersectionObserverOptions {
//   root?: Element | Document | null | string;
//   rootMargin?: string;
//   threshold?: number | number[];
// }
interface Props {
  item: {
    id: string;
    injected: Record<string, any>;
    height: number;
    width: number;
    columnSpan: number;
  };
}
interface Emits {
  (event: 'preview', material: any): void;
}
defineOptions({ name: 'ImageItem' });
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const { item } = toRefs(props);
</script>
