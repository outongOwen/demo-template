<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * materialBody.vue
-->
<template>
  <div id="__MATERIAL_LIST_SCROLL_EL_ID__" ref="virtualGridContainerRef" class="wh-full relative of-auto pr5px">
    <virtual-grid
      v-if="listData.length"
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
      <n-button text type="primary" @click="initializeList">重试</n-button>
    </div>
    <n-spin v-if="loaded && !errored" class="absolute-center wh-full" description="加载中..."></n-spin>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import type { Item as GridItem } from '@/components/custom/VirtualGrid.vue';
import VirtualGrid from '@/components/custom/VirtualGrid.vue';
// import { useMaterialList } from '../hooks';
// import MaterialItem from './materialItem.vue';
import { getCatalogMediumList } from '@/service/api';
import ImageItem from '@/components/module/materials/materialItem/ImageItem.vue';
// import VideoItem from '@/components/module/materials/materialItem/VideoItem.vue';
// import AudioItem from '@/components/module/materials/materialItem/AudioItem.vue';
import type { ListSchema } from '#/packages.d.ts';
defineOptions({ name: 'MaterialBody' });
interface ExposeAPI {
  updateList: () => void;
}
interface Props {
  queryCondition: Record<string, any>;
  menuType: string | number;
  listConfig?: ListSchema;
}

const props = withDefaults(defineProps<Props>(), {
  listConfig: () => ({ width: 160, height: 90, gutter: 10, pageSize: 50 })
});
const { listConfig, menuType } = toRefs(props);
// const { pageProvider, total, isFirstTimeLoading } = useMaterialList();
const virtualGridContainerRef = ref<HTMLElement | null>();
const virtualGridRef = ref<InstanceType<typeof VirtualGrid> | null>(null);
const offset = ref<number>(1);
const totalPages = ref<number>(0);
const listData = ref<any[]>([]);
const loaded = ref<boolean>(false);
const errored = ref<boolean>(false);
const componentMap: Record<string, Component> = {
  image: ImageItem,
  video: ImageItem,
  audio: ImageItem
};
const loadGridItemComponent = computed((): Component => {
  const menuTypeValue = menuType.value || '';
  const menuTypeLowerCase = String(menuTypeValue).toLowerCase();
  const component = componentMap[menuTypeLowerCase] || ImageItem;
  return component;
});
const getListConfig = () => {
  const config = { width: 160, height: 90, gutter: 10, pageSize: 50, ...listConfig };
  return { ...config, ...listConfig.value };
};

const updateList = () => {
  console.log('updateList');
};
useResizeObserver(virtualGridContainerRef, () => {
  virtualGridRef.value?.resetGrid();
});
const transformToGridList = (list: any): GridItem[] => {
  const gridList = list.reduce((pre: GridItem[], cur: any) => {
    const gridItem: GridItem = {
      id: cur.id,
      width: getListConfig().width,
      height: getListConfig().height,
      columnSpan: 1,
      renderComponent: markRaw(loadGridItemComponent),
      injected: {
        ...cur
      }
    };
    pre.push(gridItem);
    return pre;
  }, []);
  return gridList;
};

const pullData = async (): Promise<boolean> => {
  if (!totalPages.value || (totalPages.value && offset.value > totalPages.value)) {
    return true;
  }
  const listRes = await getCatalogMediumList({
    page: offset.value,
    pageSize: getListConfig().pageSize
  });
  const randomImages = transformToGridList(listRes.content);
  listData.value = [...listData.value, ...randomImages];
  offset.value += 1;
  return false;
};
const pullDataWithDelay = (): Promise<boolean> => {
  return new Promise(resolve =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(() => {
      return resolve(pullData());
    }, 1000)
  );
};
const initializeList = async () => {
  try {
    loaded.value = true;
    errored.value = false;
    const listRes = await getCatalogMediumList({
      page: offset.value,
      pageSize: getListConfig().pageSize
    });
    totalPages.value = listRes.totalPages;
    listData.value = transformToGridList(listRes.content);
    offset.value += 1;
  } catch (error) {
    errored.value = true;
  } finally {
    loaded.value = false;
  }
};
onMounted(() => {
  initializeList();
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
