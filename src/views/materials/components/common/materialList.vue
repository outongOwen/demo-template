<!--
 * 素材列表组件
 * @author: owenTong
 * @since: 2023-04-23
 * materialList.vue
-->
<template>
  <div id="__MATERIAL_LIST_SCROLL_EL_ID__" ref="virtualGridContainerRef" class="wh-full of-auto pr5px relative">
    <virtual-grid
      v-if="materialList.length"
      ref="virtualGridRef"
      :scroll-element="virtualGridContainerRef"
      :items="materialList"
      :update-function="pullDataWithDelay"
      :get-grid-gap="() => listConfig.gutter!"
      :get-column-count="(elementWidth: number) => {
          return Math.floor(elementWidth / listConfig.width!);
        }"
    >
      <template #default="{ item }">
        <component
          :is="renderComponent"
          v-if="renderComponent"
          :item="item"
          :intersection-observer-options="{
            root: virtualGridContainerRef
          }"
          lazy
        />
      </template>
    </virtual-grid>
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
import type { ListSchema, ExtendMenuOptions } from '#/packages.d.ts';
defineOptions({ name: 'MaterialList' });
interface ExposeAPI {
  refreshList: () => void;
}
interface Props {
  options: ExtendMenuOptions;
  queryCondition?: Record<string, any>;
  renderComponent?: Component;
}

const props = withDefaults(defineProps<Props>(), {
  // listConfig: () => ({ width: 160, height: 90, gutter: 10, pageSize: 50 }),
  queryCondition: () => ({}),
  renderComponent: () => null
});
const { options, queryCondition } = toRefs(props);
// const { pageProvider, total, isFirstTimeLoading } = useMaterialList();
const virtualGridContainerRef = ref<HTMLElement | null>();
const virtualGridRef = ref<InstanceType<typeof VirtualGrid> | null>(null);
// const materialListContainerRef = ref<HTMLElement | null>();
const offset = ref<number>(1);
const totalPages = ref<number>(0);
const materialList = ref<any[]>([]);
const loaded = ref<boolean>(false);
const errored = ref<boolean>(false);
const listConfig = computed((): ListSchema => {
  const config = { width: 160, height: 90, gutter: 10, pageSize: 50 };
  const listSchema = options.value.listSchema || {};
  return { ...config, ...listSchema };
});
useResizeObserver(virtualGridContainerRef, () => {
  virtualGridRef.value?.resetGrid();
});
const transformToGridList = (list: any): GridItem[] => {
  const gridList = list.reduce((pre: GridItem[], cur: any) => {
    const gridItem: GridItem = {
      id: cur.id,
      width: listConfig.value.width,
      height: listConfig.value.height!,
      columnSpan: 1,
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
    pageSize: listConfig.value.pageSize!,
    ...queryCondition.value
  });
  const randomImages = transformToGridList(listRes.content);
  materialList.value = [...materialList.value, ...randomImages];
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
      pageSize: listConfig.value.pageSize!,
      ...queryCondition.value
    });
    totalPages.value = listRes.totalPages;
    materialList.value = transformToGridList(listRes.content);
    offset.value += 1;
  } catch (error) {
    errored.value = true;
  } finally {
    loaded.value = false;
  }
};
const refreshList = () => {
  offset.value = 1;
  totalPages.value = 0;
  materialList.value = [];
  initializeList();
};
onMounted(() => {
  initializeList();
});

defineExpose<ExposeAPI>({
  refreshList
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
