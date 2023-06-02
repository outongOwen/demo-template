<!--
 * @Description: 播放器控制按钮
 * @author: owenTong
 * @since: 2023-06-02
 * PlayerControlsBtn.vue
-->
<template>
  <div
    ref="playerControlContainerRef"
    class="wh100% flex flex-justify-between items-center relative flex-nowrap of-hidden"
  >
    <n-space :size="10">
      <n-popselect
        v-model:value="proportionModelValue"
        trigger="click"
        size="small"
        :options="proportionOptions"
        @update:value="handleProportionSelect"
      >
        <n-button secondary strong size="small" class="w-90px">
          <n-ellipsis>
            {{ `比例 ${proportionModelValue}` }}
          </n-ellipsis>
        </n-button>
      </n-popselect>
      <n-popselect
        v-model:value="speedModelValue"
        trigger="click"
        size="small"
        :options="speedOptions"
        @update:value="handleSpeedSelect"
      >
        <n-button secondary strong size="small" class="w-90px">
          <n-ellipsis>
            {{ `倍速 ${speedModelValue}x` }}
          </n-ellipsis>
        </n-button>
      </n-popselect>
    </n-space>
    <n-space size="small" class="absolute-transform-center of-hidden" align="center" justify="center">
      <slot name="controlBtnList">
        <template v-for="item in controlListMixOptions" :key="item.type">
          <n-button
            v-if="item.type === 'play' && !playing"
            class="bg-transparent !py5px"
            size="small"
            strong
            secondary
            :focusable="false"
          >
            <template #icon>
              <n-icon :size="40" class="cursor-pointer" @click="item.event">
                <Icon :icon="item.icon" />
              </n-icon>
            </template>
          </n-button>
          <n-button
            v-else-if="item.type === 'pause' && playing"
            class="bg-transparent"
            size="small"
            strong
            secondary
            :focusable="false"
          >
            <template #icon>
              <n-icon :size="40" @click="item.event">
                <Icon :icon="item.icon" />
              </n-icon>
            </template>
          </n-button>
          <n-button
            v-else-if="item.type !== 'play' && item.type !== 'pause' && item?.show"
            class="child bg-transparent !p5px"
            size="small"
            strong
            secondary
            :focusable="false"
          >
            <template #icon>
              <n-icon size="25" @click="item.event(item.time)">
                <Icon :icon="item.icon" />
              </n-icon>
            </template>
          </n-button>
        </template>
      </slot>
    </n-space>
    <n-button class="bg-transparent" size="small" strong secondary :focusable="false">
      <template #icon>
        <n-icon size="23">
          <icon-ri:fullscreen-fill v-show="!false" />
          <icon-ri:fullscreen-exit-fill v-show="false" />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { reactiveComputed, useResizeObserver, useVModels } from '@vueuse/core';
import { Icon } from '@iconify/vue';
export interface ControlListOptions {
  title?: string;
  type: string;
  icon: string;
  time?: number;
  event: (time?: number) => void;
  [str: string]: any;
}
interface ControlListMixOptions extends ControlListOptions {
  show: boolean;
}
interface Props {
  proportion: string;
  speed: number;
  playing: boolean;
  controlListOptions: ControlListOptions[];
}
interface Emits {
  (e: 'update:proportion', value: string): void;
  (e: 'update:speed', value: number): void;
  (e: 'speedChange', value: number, option: any): void;
  (e: 'proportionChange', value: string, option: any): void;
}
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const { proportion: proportionModelValue, speed: speedModelValue } = useVModels(props, emits);
const { controlListOptions, playing } = toRefs(props);
const proportionOptions = [
  {
    label: '16:9',
    value: '16:9'
  },
  {
    label: '9:16',
    value: '9:16'
  },
  {
    label: '1:1',
    value: '1:1'
  },
  {
    label: '21:9',
    value: '21:9'
  },
  {
    label: '4:3',
    value: '4:3'
  },
  {
    label: '自由',
    value: 'free'
  }
];
const speedOptions = [
  {
    label: '0.5x',
    value: 0.5
  },
  {
    label: '0.75x',
    value: 0.75
  },
  {
    label: '1x',
    value: 1
  },
  {
    label: '1.5x',
    value: 1.5
  },
  {
    label: '1.75x',
    value: 1.75
  },
  {
    label: '2x',
    value: 2
  },
  {
    label: '3x',
    value: 3
  }
];
const playerControlContainerRef = ref<HTMLElement>();
const controlListMixOptions = reactiveComputed<ControlListMixOptions[]>(() => {
  return controlListOptions.value.map(item => {
    return {
      ...item,
      show: true
    };
  });
});
/**
 * 比例选择
 */
const handleProportionSelect = (key: string, option: SelectOption) => {
  emits('proportionChange', key, option);
};
/**
 * 速率选择
 */
const handleSpeedSelect = (key: number, option: SelectOption) => {
  emits('speedChange', key, option);
};
/**
 * 根据父容器判断按钮显示数量
 */
useResizeObserver(playerControlContainerRef, entries => {
  const entry = entries[0];
  const { width } = entry.contentRect;
  if (width < 700) {
    controlListMixOptions[0].show = false;
    controlListMixOptions[controlListMixOptions.length - 1].show = false;
  } else {
    controlListMixOptions[0].show = true;
    controlListMixOptions[controlListMixOptions.length - 1].show = true;
  }
  if (width < 600) {
    controlListMixOptions[1].show = false;
    controlListMixOptions[controlListMixOptions.length - 2].show = false;
  } else {
    controlListMixOptions[1].show = true;
    controlListMixOptions[controlListMixOptions.length - 2].show = true;
  }
  if (width < 550) {
    controlListMixOptions[2].show = false;
    controlListMixOptions[controlListMixOptions.length - 3].show = false;
  } else {
    controlListMixOptions[2].show = true;
    controlListMixOptions[controlListMixOptions.length - 3].show = true;
  }
});
</script>
