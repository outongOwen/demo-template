<!--
 * new page
 * @author: owenTong
 * @since: 2023-04-23
 * materialBody.vue
-->
<template>
  <div id="material-list-body" :style="{ height: `${materialBodySize.height}px` }">
    <VirtualListGrid
      :page-provider="pageProvider"
      :total="total"
      :width="192"
      :height="108"
      :space-size="20"
      :respect-scroll-to-on-resize="true"
      scroll-behavior="smooth"
    >
      <template #default="{ item, aspectRatio }">
        <material-item
          :item-data="item"
          :aspect-ratio="aspectRatio"
          lazy
          :intersection-observer-options="{
            root: '#material-list-body'
          }"
        />
      </template>
    </VirtualListGrid>
  </div>
</template>

<script setup lang="ts">
import { useMaterialList } from '../hooks';
import MaterialItem from './materialItem.vue';
defineOptions({ name: 'MaterialBody' });
interface Props {
  materialBodySize: {
    width: number;
    height: number;
  };
}
const props = defineProps<Props>();
const { materialBodySize } = toRefs(props);
const { pageProvider, total } = useMaterialList();
</script>

<!-- <style lang="scss" scoped> -->
// #__SCROLL_EL_ID__ { // @include scrollbar(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3)); // } // .dark #__SCROLL_EL_ID__ {
// @include scrollbar(); // }
<!-- </style> -->
