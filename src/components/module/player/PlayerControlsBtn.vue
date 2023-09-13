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
        :value="proportionModelValue"
        trigger="click"
        size="small"
        :options="proportionOptions"
        display-directive="show"
        placement="top"
        @update:value="handleProportionSelect"
      >
        <n-button secondary strong size="small" class="w-90px">
          <n-ellipsis>
            {{ `比例 ${proportionModelValue === 'free' ? '自由' : proportionModelValue}` }}
          </n-ellipsis>
        </n-button>
      </n-popselect>
      <n-popselect
        v-model:value="speedModelValue"
        trigger="click"
        size="small"
        :options="speedOptions"
        display-directive="show"
        placement="top"
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
    <n-button class="bg-transparent" size="small" strong secondary :focusable="false" @click="handleFullScreen">
      <template #icon>
        <n-icon size="23">
          <icon-ri:fullscreen-fill v-show="!isCssFullscreen" />
          <icon-ri:fullscreen-exit-fill v-show="isCssFullscreen" />
        </n-icon>
      </template>
    </n-button>
  </div>
  <n-modal
    v-model:show="showFreeProportionModal"
    preset="dialog"
    positive-text="确定"
    negative-text="取消"
    class="dark:bg-dark"
    :show-icon="false"
    :closable="false"
    :auto-focus="false"
    @positive-click="handleFreeProportionConfirm"
    @negative-click="showFreeProportionModal = false"
    @after-leave="handleFreeProportionLeave"
  >
    <template #header>
      <n-el tag="div" class="w100% text-center">自由比例</n-el>
    </template>
    <n-el tag="div" class="border-y-1px border-color-[var(--border-color)] py-20px">
      <n-space class="!flex-nowrap" align="center">
        <n-input-number
          v-model:value="freeProportion.width"
          :max="maxResolution"
          :min="minResolution"
          @update:value="handleFreeProportionWidth"
        >
          <template #suffix>W</template>
        </n-input-number>
        <n-icon :size="25" class="flex-center cursor-pointer select-none" @click="handleProportionLockChange">
          <svg-icon :icon="freeProportionLocked ? 'pixelarticons:link' : 'pixelarticons:unlink'" />
        </n-icon>
        <n-input-number
          v-model:value="freeProportion.height"
          :max="maxResolution"
          :min="minResolution"
          @update:value="handleFreeProportionHeight"
        >
          <template #suffix>H</template>
        </n-input-number>
      </n-space>
    </n-el>
  </n-modal>
</template>

<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { cloneDeep } from 'lodash';
import { reactiveComputed, useResizeObserver, useVModels, watchOnce } from '@vueuse/core';
import { Icon } from '@iconify/vue';
import { playerSettings } from '@/settings';
defineOptions({ name: 'PlayerControlsBtn' });
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
interface FreeProportion {
  width: number;
  height: number;
}
export interface SelectMixOption extends SelectOption {
  resolution: FreeProportion;
}

interface Props {
  playing: boolean;
  proportion: string;
  speed: number;
  /** 控制按钮列表 */
  controlListOptions: ControlListOptions[];
  isFullscreen?: boolean;
}
interface Emits {
  /**
   * @description VModel 比例
   */
  (event: 'update:proportion', value: string): void;
  /**
   * @description VModel 速率
   */
  (event: 'update:speed', value: number): void;
  /**
   * @description 改变速率
   */
  (event: 'speedChange', value: number, option: any): void;
  /**
   * @description 改变比例
   */
  (event: 'proportionChange', value: string, option: any): void;
  /**
   * @description 全屏
   */
  (event: 'cssFullscreenChange', state: boolean): void;
}
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const { proportion: proportionModelValue, speed: speedModelValue } = useVModels(props, emits);
const { controlListOptions, playing, isFullscreen } = toRefs(props);
const { maxResolution, minResolution, shortestEdgeMaxResolution, shortestEdgeMinResolution, resolutionReferenceBase } =
  playerSettings;
const isCssFullscreen = ref<boolean>(false); // css全屏开关
const showFreeProportionModal = ref<boolean>(false); // 自由比例弹窗开关
const freeProportionLocked = ref<boolean>(false); // 自由比例锁定开关
const freeProportionLockedValue = ref<FreeProportion | null>(null); // 缓存锁定比例
const cacheFreeProportion = ref<FreeProportion | null>(null); // 缓存自由比例
const isRestFreeProportion = ref<boolean>(true); // 重置自由比例开关
const freeProportion = reactive<FreeProportion>({
  width: 0,
  height: 0
}); // 自由比例
const proportionOptions = [
  {
    label: '21:9',
    value: '21:9',
    resolution: {
      width: resolutionReferenceBase * (21 / 9),
      height: resolutionReferenceBase
    }
  },
  {
    label: '16:9',
    value: '16:9',
    resolution: {
      width: resolutionReferenceBase * (16 / 9),
      height: resolutionReferenceBase
    }
  },
  {
    label: '9:16',
    value: '9:16',
    resolution: {
      width: resolutionReferenceBase,
      height: resolutionReferenceBase * (16 / 9)
    }
  },
  {
    label: '1:1',
    value: '1:1',
    resolution: {
      width: resolutionReferenceBase,
      height: resolutionReferenceBase
    }
  },

  {
    label: '4:3',
    value: '4:3',
    resolution: {
      width: resolutionReferenceBase * (4 / 3),
      height: resolutionReferenceBase
    }
  },
  {
    label: '自由',
    value: 'free',
    resolution: {
      width: 0,
      height: 0
    }
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
const handleProportionSelect = (key: string, option: SelectMixOption) => {
  if (key !== 'free') {
    proportionModelValue.value = key;
    freeProportion.width = option.resolution.width;
    freeProportion.height = option.resolution.height;
    emits('proportionChange', key, option);
  } else {
    showFreeProportionModal.value = true;
    cacheFreeProportion.value = cloneDeep(freeProportion);
  }
};
/**
 * 速率选择
 */
const handleSpeedSelect = (key: number, option: SelectOption) => {
  emits('speedChange', key, option);
};
/**
 * 全屏
 */
const handleFullScreen = () => {
  isCssFullscreen.value = !isCssFullscreen.value;
  emits('cssFullscreenChange', isCssFullscreen.value);
};

/**
 * 自由比例确定
 */
const handleFreeProportionConfirm = () => {
  // 通过遍历对象判断对象值是否超出最大最小值
  const shortestEdgeResolution = Math.min(...Object.values(freeProportion));
  if (shortestEdgeResolution > shortestEdgeMaxResolution) {
    window.$message?.warning(`最短边不能超过${shortestEdgeMaxResolution}`);
    return false;
  }
  if (shortestEdgeResolution < shortestEdgeMinResolution) {
    window.$message?.warning(`最短边不能小于${shortestEdgeMinResolution}`);
    return false;
  }
  proportionModelValue.value = 'free';
  const freeOption = cloneDeep(proportionOptions).find(item => item.value === 'free');
  freeOption && (freeOption!.resolution = { ...freeProportion }) && emits('proportionChange', 'free', freeOption);
  isRestFreeProportion.value = false;
  return true;
};
/**
 * modal关闭
 */
const handleFreeProportionLeave = () => {
  freeProportionLockedValue.value = null;
  freeProportionLocked.value = false;
  if (cacheFreeProportion.value && isRestFreeProportion.value) {
    freeProportion.width = cacheFreeProportion.value.width;
    freeProportion.height = cacheFreeProportion.value.height;
  }
  cacheFreeProportion.value = null;
  isRestFreeProportion.value = true;
};
/**
 * 比例锁定
 */
const handleProportionLockChange = () => {
  freeProportionLocked.value = !freeProportionLocked.value;
  freeProportionLocked.value && (freeProportionLockedValue.value = { ...freeProportion });
};
/**
 * 自由比例输入(width)
 */
const handleFreeProportionWidth = (value: number | null) => {
  if (freeProportionLocked.value && freeProportionLockedValue.value && value) {
    const { width, height } = freeProportionLockedValue.value;
    const ratio = width / height;
    freeProportion.height = Math.round(value / ratio);
  }
};
/**
 * 自由比例输入(height)
 */
const handleFreeProportionHeight = (value: number | null) => {
  if (freeProportionLocked.value && freeProportionLockedValue.value && value) {
    const { width, height } = freeProportionLockedValue.value;
    const ratio = height / width;
    freeProportion.width = Math.round(value / ratio);
  }
};
watchEffect(() => {
  isCssFullscreen.value = isFullscreen.value;
});
watchOnce(
  proportionModelValue,
  () => {
    const curProportion = proportionOptions.find(item => item.value === proportionModelValue.value);
    if (curProportion) {
      const { width, height } = curProportion.resolution;
      freeProportion.width = width;
      freeProportion.height = height;
    }
  },
  {
    immediate: true
  }
);
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
