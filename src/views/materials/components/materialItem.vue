<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-26
 * materialItem.vue
-->
<template>
  <div
    :style="[itemData.style!, { 'aspect-ratio': `${aspectRatio}` }]"
    class="flex-center! block dark:bg-#000 bg-[rgba(25,25,25,0.1)] relative"
  >
    <n-image
      v-if="itemData?.item?.image"
      :src="itemData?.item?.image"
      :lazy="lazy"
      fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
      object-fit="contain"
      class="wh-full"
      :intersection-observer-options="intersectionObserverOptions"
    >
      <template #placeholder>
        <!-- <div class="w-full flex-center">加载中</div> -->
        <n-skeleton class="w-full" />
      </template>
    </n-image>
    <div class="absolute-bl left-0 right-0 dark:bg-[rgba(0,0,0,.3)] text-center">
      <n-text class="w100% px10px break-words line-clamp-4">
        {{ itemData.index }}
      </n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IntersectionObserverOptions {
  root?: Element | Document | null | string;
}
interface Props {
  itemData: {
    index: number;
    item: {
      image: string;
      name: string;
      id: string;
      duration: number;
    };
    style?: {
      transform: string;
      gridArea: string;
    };
  };
  aspectRatio?: number;
  intersectionObserverOptions?: IntersectionObserverOptions;
  lazy?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  intersectionObserverOptions: undefined,
  aspectRatio: 1,
  lazy: false
});
const { itemData, aspectRatio } = toRefs(props);
</script>

<style scoped lang="scss">
:deep(.n-image) {
  img {
    @apply wh-full;
  }
}
</style>
