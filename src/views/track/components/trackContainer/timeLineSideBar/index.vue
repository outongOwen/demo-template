<template>
  <n-space class="wh-full flex-nowrap! px-10px" :size="8" align="center">
    <n-button
      v-if="getSideBarOptionBySideBarId?.deleted"
      quaternary
      :focusable="false"
      size="tiny"
      @click="handleRowDeleteOperation"
      @mouseenter="() => (isMoveEnter = true)"
      @mouseleave="() => (isMoveEnter = false)"
    >
      <template #icon>
        <n-icon size="20">
          <Icon :icon="isMoveEnter ? 'material-symbols:delete-sharp' : (getSideBarOptionBySideBarId.icon as string)" />
        </n-icon>
      </template>
    </n-button>
    <n-button
      v-if="getSideBarOptionBySideBarId?.locked"
      quaternary
      :focusable="false"
      size="tiny"
      @click="handleSetLockRow"
    >
      <template #icon>
        <n-icon size="20">
          <Icon :icon="timeLineRow.locked ? 'carbon:locked' : 'carbon:unlocked'" />
        </n-icon>
      </template>
    </n-button>
    <n-button
      v-if="getSideBarOptionBySideBarId?.hided"
      quaternary
      :focusable="false"
      size="tiny"
      @click="handleSetHideRow"
    >
      <template #icon>
        <n-icon size="20">
          <Icon :icon="timeLineRow.hided ? 'ci:hide' : 'ci:show'" />
        </n-icon>
      </template>
    </n-button>
    <n-button
      v-if="getSideBarOptionBySideBarId?.muted"
      quaternary
      :focusable="false"
      size="tiny"
      @click="handleSetMuteRow"
    >
      <template #icon>
        <n-icon size="20">
          <Icon :icon="timeLineRow.muted ? 'charm:sound-mute' : 'charm:sound-down'" />
        </n-icon>
      </template>
    </n-button>
  </n-space>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { TimelineRow } from '@/plugins/timeLine';
import { timeLineSideBarOptions, defaultTimeLineSideBarOptionItem } from './index';
interface Props {
  timeLineRow: TimelineRow;
  sideBarRef?: Record<string, any> | null;
}
defineOptions({
  name: 'TimeLineSideBar'
});
const props = defineProps<Props>();
const { timeLineRow, sideBarRef } = toRefs(props);
const isMoveEnter = ref<boolean>(false);
// 根据轨道行ID获取轨道行侧边栏配置项
const getSideBarOptionBySideBarId = computed(() => {
  if (timeLineRow.value.sideBarId && timeLineSideBarOptions[timeLineRow.value.sideBarId]) {
    return timeLineSideBarOptions[timeLineRow.value.sideBarId];
  }
  return defaultTimeLineSideBarOptionItem;
});
const handleRowDeleteOperation = () => {
  if (timeLineRow.value.type === 'main') {
    sideBarRef?.value?.clearRow && sideBarRef.value.clearRow(timeLineRow.value);
  } else {
    sideBarRef?.value?.deleteRow && sideBarRef.value.deleteRow(timeLineRow.value);
  }
};
const handleSetMuteRow = () => {
  sideBarRef?.value?.setMuteRow && sideBarRef.value.setMuteRow(timeLineRow.value);
};
const handleSetLockRow = () => {
  sideBarRef?.value?.setLockRow && sideBarRef.value.setLockRow(timeLineRow.value);
};
const handleSetHideRow = () => {
  sideBarRef?.value?.setHideRow && sideBarRef.value.setHideRow(timeLineRow.value);
};
</script>

<style scoped></style>
