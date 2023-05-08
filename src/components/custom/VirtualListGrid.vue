<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-28
 * VirtualListGrid.vue
-->
<template>
  <div class="wh-full relative of-auto">
    <Grid
      :length="total"
      :page-size="pageSize"
      :scroll-behavior="scrollBehavior"
      :page-provider="pageProvider"
      :respect-scroll-to-on-resize="respectScrollToOnResize"
      class="grid"
      :style="{
        'grid-gap': `${spaceSize}px`,
        grid: `${spaceSize}px`,
        'grid-template-columns': `repeat(auto-fill,minmax(${width}px,1fr))`
      }"
    >
      <!-- <template #probe>
        <div :style="{ width: `${width}px`, height: `${height}px` }" />
      </template>
      <template #placeholder="{ style }">
        <!~~ <n-skeleton :style="[{ ...style }]" class="h100%" /> ~~>
        <div :style="[{ ...style }]"></div>
      </template>-->
      <template #default="mItem">
        <slot :item="mItem" :aspect-ratio="width / height"></slot>
      </template>
    </Grid>
    <n-spin v-show="loading" description="加载中" class="absolute-center dark:bg-dark bg-#fff z999" />
  </div>
</template>

<script setup lang="ts">
import Grid from 'vue-virtual-scroll-grid';
defineOptions({ name: 'VirtualListGrid' });
interface Props {
  pageProvider: (pageNumber: number, pageSize: number) => Promise<any[]>;
  total: number;
  pageSize?: number;
  width?: number;
  height?: number;
  spaceSize?: number;
  respectScrollToOnResize?: boolean;
  scrollBehavior?: 'auto' | 'smooth';
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  width: 169,
  height: 95,
  spaceSize: 10,
  respectScrollToOnResize: false,
  scrollBehavior: 'auto',
  pageSize: 100,
  loading: false
});
const { pageProvider, total, width, height, loading } = toRefs(props);
</script>

<style scoped></style>
