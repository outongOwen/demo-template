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
        <component :is="renderComponent" v-if="renderComponent" :item="item" @preview="handlePreview" />
      </template>
    </virtual-grid>
    <div v-if="errored" class="absolute-center wh-full flex">
      <n-text>加载失败，请</n-text>
      <n-button text type="primary" @click="initializeList">重试</n-button>
    </div>
    <n-spin v-if="loaded && !errored" class="absolute-center wh-full" description="加载中..."></n-spin>
  </div>
  <material-preview-modal
    v-if="previewType"
    v-model:showModal="showModal"
    :material-data="previewMaterial"
    :preview-type="previewType"
  />
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import type { Item as GridItem } from '@/components/custom/VirtualGrid.vue';
import VirtualGrid from '@/components/custom/VirtualGrid.vue';
import type { PreviewType } from '@/components/module/materials/materialPreviewModal/index.vue';
import MaterialPreviewModal from '@/components/module/materials/materialPreviewModal/index.vue';
defineOptions({ name: 'MaterialList' });
interface ExposeAPI {
  refreshList: () => void;
}
interface Props {
  options: GlobalMenuOptions.ExtendMenuOptions;
  renderComponent?: Component;
  request: (offset: number, pageSize: number) => Promise<any>;
}
const props = withDefaults(defineProps<Props>(), {
  renderComponent: () => null
});
const { options } = toRefs(props);
// const { pageProvider, total, isFirstTimeLoading } = useMaterialList();
const virtualGridContainerRef = ref<HTMLElement | null>();
const virtualGridRef = ref<InstanceType<typeof VirtualGrid> | null>(null);
// const materialListContainerRef = ref<HTMLElement | null>();
const offset = ref<number>(1);
const totalPages = ref<number>(0);
const materialList = ref<any[]>([]);
const loaded = ref<boolean>(false);
const errored = ref<boolean>(false);
const showModal = ref<boolean>(false);
const previewMaterial = ref<any>({});
const listConfig = computed((): GlobalMenuOptions.ListSchema => {
  const config = { width: 160, height: 110, gutter: 10, pageSize: 50 };
  const listSchema = options.value.listSchema || {};
  return { ...config, ...listSchema };
});
const previewType = computed((): PreviewType | undefined => {
  const previewTypes = ['Video', 'Audio', 'Image', 'Transparent'];
  return options.value.key && previewTypes.includes(options.value.key as string)
    ? (options.value.key as PreviewType)
    : undefined;
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
  showModal.value = false;
  const listRes = await props.request(offset.value, listConfig.value.pageSize!);
  const randomImages = transformToGridList(listRes.content);
  materialList.value = [...materialList.value, ...randomImages];
  offset.value += 1;
  return false;
};
const pullDataWithDelay = (): Promise<boolean> => {
  return new Promise(resolve =>
    // eslint-disable-next-line no-promise-executor-return
    resolve(pullData())
  );
};
const initializeList = async () => {
  try {
    const listRes = await props.request(offset.value, listConfig.value.pageSize!);
    loaded.value = true;
    errored.value = false;
    showModal.value = false;
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
/**
 * 预览
 */

const handlePreview = (material: any) => {
  showModal.value = true;
  previewMaterial.value = material.injected;
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
