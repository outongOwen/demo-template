<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-25
 * index.vue
-->
<template>
  <div class="timeLine-sideBar-container" :style="{ width: sideBarWidth + 'px' }">
    <div
      class="top-cover"
      :style="{
        height: scaleHeight! + 'px'
      }"
    />
    <div
      class="sideBar-list"
      :style="{
        top: -scrollInfo.y.value + scaleHeight! + 'px',
        minHeight: `calc(100% - ${scaleHeight! - 8}px)`
      }"
    >
      <ul
        class="sideBar-ul"
        :style="{
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
    <div class="bottom-cover" />
    <div class="timeLine-divider" />
  </div>
</template>
<script setup lang="ts">
import type { VNodeChild } from 'vue';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
// import { useMainRow } from '../../hooks';
import type { TimelineRow } from '../../types';
interface Expose {
  setHideRow: (row: TimelineRow) => void;
  setLockRow: (row: TimelineRow) => void;
  setMuteRow: (row: TimelineRow) => void;
  clearRow: (row: TimelineRow) => void;
}
defineOptions({
  name: 'TimeLineBar'
});
const { injectTimeLineContext } = useTimeLineContext();
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineStateContext = injectTimeLineStateContext();
const timeLineContext = injectTimeLineContext();
// const mainRowRef = ref<HTMLElement | null>();
const { sideBarWidth, editorData, rowHeight, sideBars, scaleHeight, rowSpacing, mainRowId, background } =
  toRefs(timeLineContext);
const { scrollInfo } = timeLineStateContext;
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
  align-items: flex-start;
  position: relative;
  justify-content: flex-start;
  top: 0;
  left: 0;
  box-shadow: 0 0 5px #000;
  z-index: 11;
  .top-cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: v-bind('background');
  }
  .bottom-cover {
    position: absolute;
    height: 8px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: v-bind('background');
  }
  .sideBar-list {
    align-items: stretch;
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px 0;
    .sideBar-ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
