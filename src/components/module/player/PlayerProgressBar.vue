<!--
 * 播放器进度条
 * @author: owenTong
 * @since: 2022-09-21
 * PlayerProgressBar.vue
-->
<template>
  <div class="wh-full" :class="$attrs.class" :style="style">
    <div class="w-inherit h-auto flex justify-between items-center text-size-14px mb-3px">
      <n-text class="box-border tabular-nums flex-center color-primary">
        {{ playerCurrentTime }}
      </n-text>
      <n-text class="box-border tabular-nums flex-center">
        {{ playerTotalTime }}
      </n-text>
    </div>
    <div class="w100% relative z9">
      <n-slider
        v-model:value="currentTime"
        :step="progressStep"
        :max="totalTime"
        :min="0"
        :tooltip="false"
        style="padding: 0"
        @update:value="handleTimeChange"
      >
        <template #thumb>
          <div class="w18px h8px bg-primary" />
        </template>
      </n-slider>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { toRefs, useVModel } from '@vueuse/core';
import { formatFrameByTime } from '@/utils';
defineOptions({ name: 'PlayerProgressBar' });
interface Props {
  time: number;
  totalTime: number;
  style?: CSSProperties;
  frameRate?: number;
}
interface Emits {
  (event: 'update:time', value: number): void;
  (event: 'change', time: number): void;
}
const props = withDefaults(defineProps<Props>(), {
  style: () => ({}),
  frameRate: 25
});
const emits = defineEmits<Emits>();
const currentTime = useVModel(props, 'time', emits);
const { totalTime, frameRate } = toRefs(props);
const playerTotalTime = computed(() => {
  return formatFrameByTime(totalTime.value, frameRate.value);
});
const playerCurrentTime = computed(() => {
  return formatFrameByTime(currentTime.value, frameRate.value);
});
const progressStep = computed(() => {
  return Math.round((1000 / frameRate.value) * 100000) / 100000;
});
const handleTimeChange = () => {
  emits('change', currentTime.value);
};
</script>
<style lang="scss" scoped>
:deep(.n-slider-rail) {
  @apply important-rounded-0;
  .n-slider-rail__fill {
    @apply important-rounded-0;
  }
}
</style>
