<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * materialBody.vue
-->
<template>
  <div id="__MATERIAL_LIST_SCROLL_EL_ID__" ref="virtualGridContainerRef" class="wh-full relative of-auto pr5px">
    <virtual-grid
      v-if="loaded"
      ref="virtualGridRef"
      :scroll-element="virtualGridContainerRef"
      :items="listData"
      :update-function="pullDataWithDelay"
      :get-grid-gap="() => getListConfig().gutter"
      :intersection-observer-options="{
        root: virtualGridContainerRef
      }"
      lazy
      :get-column-count="(elementWidth: number) => {
          return Math.floor(elementWidth / getListConfig().width);
        }"
    />
    <div v-if="errored" class="absolute-center wh-full flex">
      <n-text>加载失败，请</n-text>
      <n-button text type="primary">重试</n-button>
    </div>
    <n-spin v-if="!loaded && !errored" class="absolute-center wh-full" description="加载中..."></n-spin>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import VirtualGrid from '@/components/custom/VirtualGrid.vue';
// import { useMaterialList } from '../hooks';
// import MaterialItem from './materialItem.vue';
import ImageItem from './imageItem.vue';
import type { ListSchema } from '#/packages.d.ts';
defineOptions({ name: 'MaterialBody' });
interface Props {
  queryCondition: Record<string, unknown>;
  menuType: string | number;
  listConfig?: ListSchema;
}
interface ExposeAPI {
  updateList: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  listConfig: () => ({ width: 170, height: 95, gutter: 10, pageSize: 50 })
});
const { listConfig } = toRefs(props);
// const { pageProvider, total, isFirstTimeLoading } = useMaterialList();
const virtualGridContainerRef = ref<HTMLElement | null>(null);
const virtualGridRef = ref<InstanceType<typeof VirtualGrid> | null>(null);
const offset = ref<number>(0);
const loaded = ref<boolean>(false);
const errored = ref<boolean>(false);
const mockError = ref<boolean>(false);
const listData = ref<any[]>([]);
const getListConfig = () => {
  const config = { width: 170, height: 95, gutter: 10, pageSize: 50, ...listConfig };
  return { ...config, ...listConfig.value };
};
const updateList = () => {
  console.log('updateList');
};

useResizeObserver(virtualGridContainerRef, () => {
  virtualGridRef.value!.resetGrid();
});
// onMounted(async () => {
//   try {
//     const list = await pageProvider(1, 100);
//     listData.value = list;
//   } catch (error) {
//     console.log(error);
//   }
// });
const pullData = (): Promise<boolean> => {
  // This is to try when we reach end of infinite scroll (only 5 loads)
  if (offset.value > 15) {
    return Promise.resolve(true);
  }
  // 返回错误
  if (offset.value === 1 && !mockError.value) {
    mockError.value = true;
    return Promise.reject(new Error('error'));
  }

  // Populate random images (for the demo)
  const randomImages = Array.from({ length: getListConfig().pageSize }, (_, index) => {
    const width = getListConfig().width;
    const height = getListConfig().height;
    const id = index + offset.value * 100;
    return {
      id: `img-${id}`,
      width,
      height,
      columnSpan: 1,
      renderComponent: markRaw(ImageItem),
      injected: {
        url: `https://picsum.photos/id/${id + 1}/${width * 3}/${height * 3}.jpg`
      }
    };
  });

  listData.value = [...listData.value, ...randomImages];

  offset.value += 1;

  // 在每个响应之间等待，只是为了看看加载器
  return Promise.resolve(false);
};
const pullDataWithDelay = (): Promise<boolean> => {
  return new Promise(resolve =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(() => {
      return resolve(pullData());
    }, 1000)
  );
};
const initializeList = () => {
  // errored.value = true;
  // throw new Error('Method not implemented.');
  pullData()
    .then(() => {
      loaded.value = true;
      virtualGridRef.value?.resetGrid();
    })
    .catch(error => {
      if (error) {
        console.error('Failed to load initial data', error);
      }
    });
};
onMounted(() => {
  nextTick(() => {
    initializeList();
  });
});

defineExpose<ExposeAPI>({
  updateList
});
</script>
<style lang="scss" scoped>
#__MATERIAL_LIST_SCROLL_EL_ID__ {
  @include scrollbar(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3));
}
.dark #__MATERIAL_LIST_SCROLL_EL_ID__ {
  @include scrollbar();
}
</style>
