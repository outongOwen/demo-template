<template>
  <ActionBar v-for="(item, index) in barItemOptions" :key="index" :options="item" />
  <!-- <main-form ref="formRef"></main-form> -->
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTimeLineStore } from '@/store';
import { useIconRender } from '@/hooks';
import ActionBar from '../actionBar/index.vue';
// import MainForm from './distributeForm/index.vue';
const { iconRender } = useIconRender();
const timeLineStore = useTimeLineStore();
const { getScaleInfo, previewCurrentState } = storeToRefs(timeLineStore);
// const formRef = ref();
const barItemOptions = reactive<Track.ActionBarItem[]>([
  {
    icon: 'mdi-magnet',
    label: '主轨道磁吸',
    btnType: 'Button',
    key: 'mainTrackMagnet',
    checked: true,
    defaultValue: '',
    beforeChange: (state?: boolean) => {
      if (state) return Promise.resolve(true);
      return new Promise(resolve => {
        window.$dialog?.create({
          showIcon: false,
          title: '确认打开主轨吸附？',
          content: '打开后将自动去除主轨空白区域，轨道内容会发生移动',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            resolve(true);
          },
          onNegativeClick: () => {
            resolve(false);
          }
        });
      });
    },
    change: key => {
      console.log(key);
    }
  },
  {
    icon: iconRender({
      icon: 'ic:sharp-link'
    }),
    label: '联动',
    btnType: 'Button',
    key: 'link',
    checked: true,
    change: key => {
      console.log(key);
    }
  },
  {
    icon: 'fluent-emoji-high-contrast:magnet',
    label: '自动吸附',
    btnType: 'Button',
    key: 'autoAlign',
    checked: true,
    change: key => {
      console.log(key);
    }
  },
  {
    icon: 'lucide:split-square-horizontal',
    label: '预览轴',
    btnType: 'Button',
    key: 'previewAxis',
    checked: true,
    change: (state: boolean) => {
      previewCurrentState.value = state;
    }
  },
  {
    icon: 'pixelarticons:scale',
    key: 'autoScale',
    label: '轨道自适应',
    btnType: 'Button',
    change: () => {
      const scale = getScaleInfo.value.scaleStep ? getScaleInfo.value.scaleStep - 0.01 : 0;
      barItemOptions[barItemOptions.length - 1].defaultValue = scale;
      timeLineStore.setScaleInfo({ scale });
      nextTick(() => {
        // consol
      }).then(() => {
        timeLineStore.timeLineRef &&
          timeLineStore.timeLineRef.scrollTo({
            left: 0
          }); // 滚动到0的位置
      });
    }
  },
  {
    label: '',
    btnType: 'Slider',
    defaultValue: 0,
    disabled: false,
    max: 1,
    min: 0,
    step: 0.01,
    markStep: 0.01,
    change: (key: number) => {
      barItemOptions[barItemOptions.length - 1].defaultValue = key;
      timeLineStore.setScaleInfo({ scale: key });
    }
  }
]);
watch(
  () => getScaleInfo.value && getScaleInfo.value.scaleStep,
  val => {
    if (val) {
      barItemOptions[barItemOptions.length - 1].markStep = val;
      barItemOptions[barItemOptions.length - 1].defaultValue = getScaleInfo.value.scale;
    }
  },
  {
    immediate: true
  }
);
</script>
