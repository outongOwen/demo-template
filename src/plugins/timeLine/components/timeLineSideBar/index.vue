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
          :ref="el => getMainRowRef(el as HTMLElement, item)"
          :style="{
            height: item?.rowHeight ? item.rowHeight + 'px' : rowHeight + 'px'
          }"
          class="sideBar-ul-li"
        >
          <slot :item-row="item" :side-bar-ref="currentInstance?.exposed">
            <component
              :is="renderSideBarComponent(item)"
              v-if="item.sideBarId"
              :key="item.id"
              :time-line-row="item"
              :side-bar-ref="currentInstance?.exposed"
            ></component>
          </slot>
        </li>
      </ul>
    </div>
    <div class="timeLine-divider" />
  </div>
</template>
<script setup lang="ts">
import type { VNodeChild } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
import { useMainRow } from '../../hooks';
import type { TimelineRow } from '../../types';

interface Props {
  scrollTop?: number;
}
defineOptions({
  name: 'TimeLineBar'
});
const props = withDefaults(defineProps<Props>(), {
  scrollTop: 0
});
const { scrollTop } = toRefs(props);
const { injectTimeLineContext } = useTimeLineContext();
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineStateContext = injectTimeLineStateContext();
const timeLineContext = injectTimeLineContext();
const isOutRange = ref(false);
const mainRowRef = ref<HTMLElement | null>();
const sideBarListRef = ref<HTMLElement | null>();
const sideBarUlRef = ref<HTMLElement | null>();
const { sideBarWidth, editorData, rowHeight, sideBars, scaleHeight, rowSpacing, mainRowId }: any =
  toRefs(timeLineContext);

const getMainRowRef = (el: HTMLElement | null, rowItem: TimelineRow) => {
  if (el && timeLineStateContext.hasMainRow.value && rowItem.type === mainRowId) {
    mainRowRef.value = el;
  }
};
// 获取当前组件实例
const currentInstance = getCurrentInstance();
const { checkMainRowBottom } = useMainRow(mainRowRef);
// 删除行
const deleteRow = (row: TimelineRow) => {
  console.log('删除行', row);
  const rowIndex = editorData.findIndex(item => item.id === row.id);
  editorData.splice(rowIndex, 1);
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
// 清空行
const clearRow = (row: TimelineRow) => {
  console.log('清空行', row);
  row.actions = [];
};
const renderSideBarComponent = (item: TimelineRow): VNodeChild | Component | null => {
  return (sideBars?.[item.sideBarId!]?.render && sideBars?.[item.sideBarId!]?.render!(item, {})) ?? null;
};
useResizeObserver([sideBarListRef, sideBarUlRef], () => {
  isOutRange.value = sideBarUlRef.value!.clientHeight + 40 >= sideBarListRef.value!.clientHeight;
  checkMainRowBottom();
});
defineExpose({
  deleteRow,
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
