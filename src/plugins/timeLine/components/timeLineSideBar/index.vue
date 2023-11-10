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
        :style="{
          transform: `translateY(-${scrollTop}px)`
        }"
      >
        <li
          v-for="item in editorData"
          :id="setMainRowId(item)"
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
            :set-delete-row="setDeleteRow"
            :set-mute-row="setMuteRow"
            :set-hide-row="setHideRow"
            :set-lock-row="setLockRow"
          ></component>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { VNodeChild } from 'vue';
import { useResizeObserver, useIntersectionObserver } from '@vueuse/core';
import { useTimeLineContext } from '../../contexts';
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
const timeLineContext = injectTimeLineContext();
const sideBarListRef = ref<HTMLElement>();
const sideBarUlRef = ref<HTMLElement>();
const isExceed = ref<boolean>(false);
const mainRowEl = ref<HTMLElement>();
const mainRowElId = ref<string>('');
const { sideBarWidth, editorData, rowHeight, sideBars, timeAreaHeight, mainRowId, mainRow } = toRefs(timeLineContext);
// 删除行
const setDeleteRow = (row: TimelineRow) => {
  console.log('删除行', row);
  const rowIndex = editorData.value.findIndex(item => item.id === row.id);
  editorData.value.splice(rowIndex, 1);
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
