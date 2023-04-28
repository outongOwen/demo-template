<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-28
 * VirtualListGrid.vue
-->
<template>
  <BetterScrollBar class="pr5px">
    <Grid
      :length="total"
      :page-size="20"
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
      <template #probe>
        <div :style="{ 'aspect-ratio': `${width / height}` }" />
      </template>
      <template #placeholder="{ index, style }">
        <div :style="[`aspect-ratio: ${width / height}`, { ...style }]" class="bg-black">Placeholder {{ index }}</div>
        <!-- <slot :item="null" :aspect-ratio="width / height"></slot> -->
      </template>
      <template #default="mItem">
        <slot :item="mItem" :aspect-ratio="width / height"></slot>
      </template>
    </Grid>
  </BetterScrollBar>
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
}
const props = withDefaults(defineProps<Props>(), {
  width: 192,
  height: 108,
  spaceSize: 20,
  respectScrollToOnResize: false,
  scrollBehavior: 'auto',
  pageSize: 20
});
const { pageProvider, total, width, height } = toRefs(props);
</script>

<style scoped></style>
