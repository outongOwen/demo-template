<!--
 * @abstract:配乐素材列表项
 * @author: owenTong
 * @since: 2023-05-06
 * imageItem.vue
-->
<template>
  <div
    :style="{ height: item.height + 'px', width: item.width + 'px' }"
    class="box-border of-hidden"
    @click="emits('preview', item)"
  >
    <div
      class="w-full h-[calc(100%-20px)] bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.3)] of-hidden px5px flex items-center !flex-nowrap"
    >
      <div class="w25px mr5px">
        <icon-mdi:music class="text-25px" />
      </div>
      <n-ellipsis class="w-[calc(100%-25px)]" line-clamp="1">
        {{ item.injected.name }}
      </n-ellipsis>
    </div>
    <n-text class="w100% h20px">
      <n-ellipsis>
        {{ formatFrameByTime(item.injected.duration) }}
      </n-ellipsis>
    </n-text>
  </div>
</template>

<script setup lang="ts">
import { formatFrameByTime } from '@/utils';
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
defineOptions({ name: 'AudioItem' });
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const { item } = toRefs(props);
</script>

<style scoped lang="scss">
:deep(.n-image) {
  @apply wh-full;
  > img {
    @apply wh-full;
  }
}
</style>
