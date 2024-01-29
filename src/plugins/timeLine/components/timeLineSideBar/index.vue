<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-25
 * index.vue
-->
<template>
  <div
    class="timeLine-sideBar-container"
    :style="{ width: getShareProps.sideBarWidth + 'px' }"
    @wheel="
      e => {
        e.preventDefault();
      }
    "
  >
    <div
      class="top-cover"
      :style="{
        height: getShareProps.scaleHeight! + 'px'
      }"
    />
    <div
      class="sideBar-list"
      :style="{
        top: -scrollInfo.y.value + Number(getShareProps.scaleHeight) + 'px',
        minHeight: `calc(100% - ${Number(getShareProps.scaleHeight)}px)`
      }"
    >
      <ul
        class="sideBar-ul"
        :style="{
          rowGap: getShareProps.rowSpacing + 'px'
        }"
      >
        <li
          v-for="item in getTimeLineEditorData"
          :key="item.id"
          :style="{
            height: item?.rowHeight ? item.rowHeight + 'px' : getShareProps.rowHeight + 'px'
          }"
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
import { useTimeLineStore } from '../../store';
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
// const mainRowRef = ref<HTMLElement | null>();
const { getShareProps, getTimeLineEditorData, scrollInfo } = useTimeLineStore();
// 获取当前组件实例
const currentInstance = getCurrentInstance();
// 删除行
const clearRow = (row: TimelineRow) => {
  console.log('删除行', row);
  if (row.type === unref(getShareProps.mainRowId)) {
    row.actions = [];
  } else {
    const rowIndex = unref(getTimeLineEditorData)!.findIndex(item => item.id === row.id);
    unref(getTimeLineEditorData)!.splice(rowIndex, 1);
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
  if (!getShareProps.sideBars) return null;
  if (!item.sideBarId) return null;
  if (!getShareProps.sideBars[item.sideBarId]) return null;
  return getShareProps.sideBars[item.sideBarId].render!(item, {});
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
    background-color: v-bind('getShareProps.background');
  }
  .bottom-cover {
    position: absolute;
    height: 8px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: v-bind('getShareProps.background');
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
