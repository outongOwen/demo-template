<template>
  <ActionBarItem v-for="(item, index) in barItemOptions" :key="index" :options="item" />
</template>

<script setup lang="ts">
import { useIconRender } from '@/hooks';
// eslint-disable-next-line import/no-unresolved
import ActionBarItem from '@/components/module/track/ActionBarItem.vue';
const { iconRender } = useIconRender();
const barItemOptions: Track.ActionBarItem[] = [
  {
    icon: 'mdi-magnet',
    label: '轨道磁吸',
    btnType: 'Button',
    key: 'mainTrackMagnet',
    checked: true,
    defaultValue: '',
    beforeChange: (state?: boolean) => {
      if (state) return Promise.resolve(true);
      return new Promise((resolve) => {
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
    change: (key) => {
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
    change: (key) => {
      console.log(key);
    }
  },
  {
    icon: 'fluent-emoji-high-contrast:magnet',
    label: '自动吸附',
    btnType: 'Button',
    key: 'autoAlign',
    checked: true,
    change: (key) => {
      console.log(key);
    }
  },
  {
    icon: 'lucide:split-square-horizontal',
    label: '预览轴',
    btnType: 'Button',
    key: 'previewAxis',
    checked: true,
    change: (key) => {
      console.log(key);
    }
  },
  {
    icon: 'pixelarticons:scale',
    key: 'autoScale',
    label: '轨道自适应',
    btnType: 'Button',
    change: (key: any) => {
      console.log(key);
    }
  },
  {
    label: '',
    btnType: 'Slider',
    defaultValue: 0,
    disabled: false,
    change: (key: any) => {
      console.log(key);
    }
  }
];
</script>
