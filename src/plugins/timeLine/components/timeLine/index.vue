<!--
 * @Description: TimeLine
 * @abstract: 时间轴编辑器
 * @author: owenTong
 * @since: 2023-06-25
 * TimeLine
-->
<template>
  <div class="timeLine-container">
    <div class="timeLine-inner-wrap">
      <TimeLineSideBar v-if="showSideBar" :scroll-top="scrollTop">
        <template #default="{ itemRow, sideBarRef }">
          <slot name="sidebar" :item-row="itemRow" :side-bar-ref="sideBarRef" />
        </template>
      </TimeLineSideBar>
      <div class="timeLine-main-wrap" :style="{ width: showSideBar ? `calc(100% - ${sideBarWidth}px)` : '100%' }">
        <TimeLineTimeArea />
        <TimeLineCursor />
        <TimeLineEditorArea @scroll="handleTimeLineScroll">
          <template #blankPlaceholder>
            <slot name="blankPlaceholder" />
          </template>
        </TimeLineEditorArea>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isString, isArray } from 'lodash';
import { consola } from 'consola';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
import type { TimeLineStateContextProps } from '../../contexts';
import TimeLineTimeArea from '../timeLineTimeArea/index.vue';
import TimeLineEditorArea from '../timeLineEditorArea/index.vue';
import TimeLineCursor from '../timeLineCursor/index.vue';
import TimeLineSideBar from '../timeLineSideBar/index.vue';
import type { TimelineEditorProps, TimelineRow } from '../../types';
import { sortTimeLineByType } from './index';
defineOptions({
  name: 'TimeLine'
});
const props = withDefaults(defineProps<TimelineEditorProps>(), {
  editorData: (): TimelineRow[] => [],
  rowHeight: 50,
  rowSpacing: 10,
  sideBarWidth: 150,
  timeAreaHeight: 50,
  leftOffset: 10,
  background: 'rgba(40,40,40,1)',
  rowBackground: 'rgba(50,50,50,1)',
  rowActiveBackground: 'rgba(70,70,70,1)',
  mainRowBackground: 'rgba(70,70,70,1)'
});
/**
 * #TODO 需要对props进行校验和初始化操作
 */
const { provideTimeLineContext } = useTimeLineContext();
const { provideTimeLineStateContext } = useTimeLineStateContext();

const timeLineStateContext = provideTimeLineStateContext(
  reactive<TimeLineStateContextProps>({
    hasMainRow: false,
    scrollBarSize: 8,
    selectedActionIds: [],
    selectedActionRefs: new Map(),
    timeLineEditorRef: null,
    setSelectedActionId: (selectId, push = false) => {
      if (!selectId) {
        timeLineStateContext.selectedActionIds = [];
      }
      if (isString(selectId)) {
        if (push) {
          if (timeLineStateContext.selectedActionIds.includes(selectId)) {
            return;
          }
          timeLineStateContext.selectedActionIds.push(selectId);
          return;
        }
        timeLineStateContext.selectedActionIds = [selectId];
      }
      if (isArray(selectId)) {
        if (push) {
          // eslint-disable-next-line no-param-reassign
          selectId = selectId.filter(item => !timeLineStateContext.selectedActionIds.includes(item));
          if (!selectId.length) return;
          timeLineStateContext.selectedActionIds.push(...selectId);
          return;
        }
        timeLineStateContext.selectedActionIds = selectId;
      }
    }
  })
);
const { showSideBar, sideBarWidth, editorData, mainRow, mainRowId, background, rowSortTypes } = toRefs(props);
const scrollTop = ref(0);
const handleTimeLineScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  scrollTop.value = target.scrollTop;
};
provideTimeLineContext({
  ...props
});
watchEffect(() => {
  // 遍历数据，判断是否开启主时间轴
  if (mainRow?.value && Boolean(mainRowId?.value)) {
    const findMainRow = editorData.value.findIndex(item => item.type === mainRowId?.value);
    timeLineStateContext.hasMainRow = findMainRow > -1;
    return;
  }
  timeLineStateContext.hasMainRow = false;
});
watchEffect(() => {
  /**
   * @description 数据校验
   */
  // 判断开启主时间轴后没有传入主时间轴ID
  if (mainRow?.value && !mainRowId?.value) {
    consola.error('mainRowId is required when mainRow is true');
  }
  // 判断主时间轴指定的mainRowId是否唯一
  if (timeLineStateContext.hasMainRow) {
    const mainRowIds = editorData.value.filter(item => item.type === mainRowId!.value);
    // editorData中必须有mainRowId匹配的type,并且保证只有一个
    if (mainRowIds.length > 1) {
      consola.error('mainRowId must be unique');
    }
    if (mainRowIds.length === 0) {
      consola.error('not find matched mainRowId in editorData');
    }
  }
});
watch(
  [editorData, rowSortTypes, mainRowId],
  () => {
    // 主时间轴排序
    if (timeLineStateContext.hasMainRow) {
      const mainRowIds = editorData.value.filter(item => item.type === mainRowId!.value);
      if (mainRowIds.length) {
        const mainRowIndex = editorData.value.findIndex(item => item.type === mainRowId!.value);
        editorData.value.push(editorData.value[mainRowIndex]);
        editorData.value.splice(mainRowIndex, 1);
      }
    }
    // 根据时间轴类型进行排序
    if (rowSortTypes?.value?.length && editorData?.value?.length) {
      const sortedEditorData = sortTimeLineByType(unref(editorData), unref(rowSortTypes)!);
      editorData.value.splice(0, editorData.value.length);
      editorData.value.push(...sortedEditorData);
    }
  },
  {
    immediate: true
  }
);
onMounted(() => {
  // // console.log(editorContainerEl.value);
  // interact('.timeLine-editor-area-inner').dropzone({
  //   accept: '.timeLine-editor-action',
  //   ondropmove(event) {
  //     console.log(event.target, 'area----ondropmove');
  //   }
  // });
});
</script>
<style lang="scss" scoped>
.timeLine-container {
  background-color: v-bind('background');
  width: 100%;
  height: 100%;
  .timeLine-inner-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;

    .timeLine-track-wrap {
      height: 100%;
      position: relative;
    }
    .timeLine-main-wrap {
      // margin-right: 5px;
    }
  }
}
</style>
