<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-21
 * leftActionBar.vue
-->
<template>
  <n-space class="!flex-nowrap mr10px" :wrap-item="false">
    <ActionBarItem v-for="(item, index) in barItemOptions" :key="index" :options="item" />
  </n-space>
</template>

<script setup lang="ts">
import { useIconRender } from '@/hooks';
const { iconRender } = useIconRender();
const barItemOptions: Track.ActionBarItem[] = [
  {
    label: '切换指正状态',
    btnType: 'CPopselect',
    cancelChecked: false,
    locked: true,
    replaced: true,
    defaultValue: 'select',
    options: [
      {
        label: '选择 A',
        value: 'select',
        icon: 'la:mouse-pointer'
      },
      {
        label: `切割 B`,
        value: 'split',
        icon: iconRender({
          icon: 'gis:split'
        })
      }
    ],
    change: (key: any) => {
      console.log(key);
    }
  },
  {
    icon: iconRender({
      icon: 'material-symbols:undo'
    }),
    label: '重做',
    btnType: 'Button',
    key: 'redo',
    change: (key: any) => {
      console.log(key);
    }
  },
  {
    icon: 'material-symbols:redo',
    label: '重做',
    btnType: 'Button',
    key: 'redo',
    change: (key: any) => {
      console.log(key);
    }
  },
  {
    icon: 'fluent:split-hint-20-filled',
    label: '左分割',
    btnType: 'Button',
    key: 'leftSplit',
    change: (key: any) => {
      console.log(key);
    }
  },
  {
    icon: 'fluent:split-hint-20-filled',
    label: '右分割',
    btnType: 'Button',
    key: 'rightSplit',
    change: (key: any) => {
      console.log(key);
    }
  },
  {
    icon: 'fluent:split-vertical-28-filled',
    label: '分割',
    btnType: 'Button',
    key: 'split',
    change: (key: any) => {
      console.log(key);
    }
  },
  {
    icon: 'carbon:copy',
    label: '复制',
    btnType: 'Button',
    key: 'copy',
    change: (key: any) => {
      console.log(key);
    }
  },
  {
    icon: 'material-symbols:delete-sharp',
    label: '删除',
    btnType: 'Button',
    key: 'delete',
    change: key => {
      console.log(key);
    }
  },
  {
    icon: 'iconoir:crop-rotate-tl',
    label: '旋转',
    btnType: 'Button',
    key: 'rotate',
    change: key => {
      console.log(key);
    }
  },
  {
    icon: 'iconoir:crop',
    label: '裁剪',
    btnType: 'Button',
    key: 'crop',
    change: key => {
      console.log(key);
    }
  },
  {
    icon: 'octicon:mirror-24',
    label: '镜像',
    btnType: 'Button',
    key: 'mirror',
    isHide: false,
    change: key => {
      console.log(key);
    }
  },
  {
    icon: 'material-symbols:width-full-outline',
    label: '定格',
    btnType: 'Button',
    key: 'freezeFrame',
    isHide: false,
    change: key => {
      console.log(key);
    }
  }
];
</script>

<style scoped></style>
