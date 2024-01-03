<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-25
 * index.vue
-->
<template>
  <div class="timeLine-sideBar-container" :style="{ width: sideBarWidth + 'px', paddingTop: scaleHeight! + 'px' }">
    <div
      ref="sideBarListRef"
      class="sideBar-list"
      :class="{
        'pos-center': !isOutRange
      }"
    >
      <ul
        ref="sideBarUlRef"
        class="sideBar-ul"
        :class="{
          'add-cover': isOutRange
        }"
        :style="{
          top: -scrollTop + 'px',
          rowGap: rowSpacing + 'px'
        }"
      >
        <li
          v-for="item in editorData"
          :key="item.id"
          :style="{
            height: item?.rowHeight ? item.rowHeight + 'px' : rowHeight + 'px'
          }"
          class="sideBar-ul-li"
        >
          <component
            :is="renderSideBarComponent(item)"
            v-if="item.sideBarId"
            :key="item.id"
            :time-line-row="item"
            :side-bar-ref="currentInstance?.exposed"
          ></component>
        </li>
      </ul>
    </div>
    <div class="timeLine-divider" />
  </div>
</template>
<script setup lang="ts">
// @ts-nocheck
/* eslint-disable */
import type { VNodeChild } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
import { useMainRow } from '../../hooks';
import type { TimelineRow } from '../../types';
interface Props {
  scrollTop?: number;
}
interface Expose {
  setHideRow: (row: TimelineRow) => void;
  setLockRow: (row: TimelineRow) => void;
  setMuteRow: (row: TimelineRow) => void;
  clearRow: (row: TimelineRow) => void;
}
defineOptions({
  name: 'TimeLineBar'
});
const props = withDefaults(defineProps<Props>(), {
  scrollTop: 0
});
const { scrollTop } = toRefs(props);
const { injectTimeLineContext } = useTimeLineContext();
// const { injectTimeLineStateContext } = useTimeLineStateContext();
// const timeLineStateContext = injectTimeLineStateContext();
const timeLineContext = injectTimeLineContext();
const isOutRange = ref(false);
// const mainRowRef = ref<HTMLElement | null>();
const sideBarListRef = ref<HTMLElement | null>();
const sideBarUlRef = ref<HTMLElement | null>();
const { sideBarWidth, editorData, rowHeight, sideBars, scaleHeight, rowSpacing, mainRowId, leftOffset } =
  toRefs(timeLineContext);

// const getMainRowRef = (el: HTMLElement | null, rowItem: TimelineRow) => {
//   if (el && timeLineStateContext.hasMainRow.value && rowItem.type === unref(mainRowId)) {
//     mainRowRef.value = el;
//   }
// };
// 获取当前组件实例
const currentInstance = getCurrentInstance();
// const { checkMainRowBottom } = useMainRow(mainRowRef);
// 删除行
const clearRow = (row: TimelineRow) => {
  console.log('删除行', row);
  if (row.type === unref(mainRowId)) {
    row.actions = [];
  } else {
    const rowIndex = unref(editorData)!.findIndex(item => item.id === row.id);
    unref(editorData)!.splice(rowIndex, 1);
  }
};
//  隐藏行
const setHideRow = (row: TimelineRow) => {
  console.log(row, '隐藏');
  row.hided = !row.hided;
};
// 锁定行
const setLockRow = (row: TimelineRow) => {
  row.locked = !row.locked;
  console.log(row, '锁定');
};
// 行静音
const setMuteRow = (row: TimelineRow) => {
  row.muted = !row.muted;
  console.log(row, '静音');
};
const renderSideBarComponent = (item: TimelineRow): VNodeChild | Component | null => {
  return (sideBars?.value?.[item.sideBarId!]?.render && sideBars.value?.[item.sideBarId!]?.render!(item, {})) ?? null;
};
useResizeObserver([sideBarListRef, sideBarUlRef], () => {
  isOutRange.value = sideBarUlRef.value!.clientHeight + 40 >= sideBarListRef.value!.clientHeight;
  // checkMainRowBottom();
});
defineExpose<Expose>({
  setHideRow,
  setLockRow,
  setMuteRow,
  clearRow
});
</script>

<style scoped lang="scss">
.timeLine-sideBar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  // margin-right: 5px;
  border-right: 1px solid #000;
  box-shadow: 0 0 5px #000;
  z-index: 999;
  .pos-center {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .add-cover {
    margin: 20px 0;
  }
  .sideBar-list {
    height: 100%;
    overflow: hidden;
    .sideBar-ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      .sideBar-ul-li {
        overflow: hidden;
      }
    }
  }
}
</style>
