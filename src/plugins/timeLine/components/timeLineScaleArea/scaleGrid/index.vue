<template>
  <div
    style="position: relative; flex-shrink: 0"
    :style="{ width: width + 'px', height: Number(getShareProps.scaleHeight) - 5 + 'px' }"
  >
    <!-- 小格 -->
    <div class="grid-container" :style="{ width: width + 'px', height: height + 'px' }"></div>

    <!-- 数字 -->
    <div v-if="showNumber" class="grid-number" :style="{ marginTop: height + 2 + 'px' }">
      {{ time }}
    </div>
  </div>
</template>

<script setup lang="ts">
// import { ref, watchEffect, defineProps, computed } from 'vue';
import { useTimeLineStore } from '../../../store';
import Mapping from '../../../utils/map';
defineOptions({
  name: 'ScaleGrid'
});
interface Props {
  width: number;
  frame: number;
  showNumber: boolean;
}
// 接收参数
const props = defineProps<Props>();
const { width, frame, showNumber } = toRefs(props);
const { getShareProps } = useTimeLineStore();
// 小格的高度
const height = computed(() => (unref(showNumber) ? 10 : 5));

// 小格的显示时间
const time = computed(() => Mapping.frame2Time(unref(frame) ? unref(frame) : 0, 30));
</script>

<style scoped lang="scss">
.grid-container {
  position: absolute;
  bottom: 0;
  left: 0;
  // background: #202020;
  border-left: 1.5px solid #707070;
}

.grid-number {
  position: absolute;
  left: 0;
  top: -7px;
  color: #979797;
  font-weight: bold;
  font-size: 12px;
  transform: scale(0.83333333);
  transform-origin: left center;
  line-height: 18px;
}
</style>
