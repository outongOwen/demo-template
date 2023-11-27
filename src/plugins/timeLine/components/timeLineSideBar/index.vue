<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-25
 * index.vue
-->
<template>
  <div
    ref="sideBarListRef"
    class="timeLine-sideBar-container"
    :style="{ width: sideBarWidth + 'px', paddingTop: timeAreaHeight + 'px' }"
  >
    <div
      class="sideBar-list"
      :class="{
        'pos-center': !isExceed
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
          :id="setMainRowId(item)"
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
              :set-delete-row="setDeleteRow"
              :set-mute-row="setMuteRow"
              :set-hide-row="setHideRow"
              :set-lock-row="setLockRow"
            ></component>
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { VNodeChild } from 'vue';
import { toReactive, useResizeObserver } from '@vueuse/core';
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
const { hasMainRow } = toReactive(timeLineStateContext);
const isOutRange = ref(false);
const mainRowRef = ref<HTMLElement | null>();
const sideBarListRef = ref<HTMLElement | null>();
const sideBarUlRef = ref<HTMLElement | null>();
const { sideBarWidth, editorData, rowHeight, sideBars, timeAreaHeight, rowSpacing, mainRowId } =
  toReactive(timeLineContext);

const getMainRowRef = (el: HTMLElement | null, rowItem: TimelineRow) => {
  if (el && hasMainRow && rowItem.type === mainRowId) {
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

const renderSideBarComponent = (item: TimelineRow): VNodeChild | Component | null => {
  return (
    (sideBars?.value?.[item.sideBarId!]?.render &&
      sideBars?.value?.[item.sideBarId!]?.render!(item, {
        setDeleteRow,
        setMuteRow,
        setHideRow,
        setLockRow
      })) ??
    null
  );
};
// 设置主时间线元素ID
const setMainRowId = (item: TimelineRow): string => {
  // 通过editorData找到主时间线
  if (mainRow?.value && mainRowId?.value && item.type === mainRowId.value) {
    const mainRowElementId = `main-row-${item.id}`;
    mainRowElId.value = mainRowElementId;
    return mainRowElementId;
  }
  return '';
};
const { isActive, pause, resume } = useIntersectionObserver(
  mainRowEl,
  ([{ isIntersecting }]) => {
    console.log(isIntersecting, 'isIntersectingisIntersectingisIntersecting');
  },
  {
    immediate: false,
    threshold: 0.9
  }
);
watch(
  mainRowElId,
  (newId: string) => {
    if (!newId) return;
    nextTick(() => {
      document.getElementById(mainRowElId.value) && (mainRowEl.value = document.getElementById(mainRowElId.value!)!);
      if (mainRowEl.value) {
        if (isActive.value) {
          pause();
        }
        resume();
      }
    });
  },
  {
    immediate: true
  }
);
useResizeObserver([sideBarListRef, sideBarUlRef], () => {
  isExceed.value = sideBarUlRef.value!.clientHeight >= sideBarListRef.value!.clientHeight;
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
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 8px;
  .pos-center {
    position: relative;
    top: 50%;
    transform: translate(0, -50%);
  }
  .sideBar-list {
    overflow: hidden;
    .sideBar-ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      .sideBar-ul-li {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 10px;
        padding-left: 10px;
      }
    }
  }
}
</style>
