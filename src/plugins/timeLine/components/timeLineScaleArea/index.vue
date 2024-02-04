<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->
<template>
  <div
    ref="timeLineScaleRef"
    class="timeLine-scale-container"
    :style="{
      left: `${offsetLeft}px`,
      height: `${getShareProps.scaleHeight}px`
    }"
  >
    <canvas ref="scaleCanvasRef" />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import { useTimeLineStore, useTimeLineScaleStore } from '../../store';
import Mapping from '../../utils/map';
defineOptions({
  name: 'TimeLineScaleArea'
});
const { getShareProps, getShareEmits, getScrollInfo, getTimeLineClipViewSize } = useTimeLineStore();
const { getGridInfo, getScaleUnit, zoomFit, getMaxFrameWidth, getMinFrameWidth } = useTimeLineScaleStore();
const timeLineScaleRef = ref(); // 刻度尺容器ref
const scaleCanvasRef = ref(); // 画布Ref
const ctx = ref(); // canvas上下文对象
const scaleStartTime = ref(0);
const offsetLeft = computed(() => {
  return Number(getShareProps.leftOffset) - getScrollInfo.x > 0
    ? Number(getShareProps.leftOffset) - getScrollInfo.x
    : 0;
});
const drawScale = () => {
  // 一小格的宽度px cellWidth
  const cellWidth = getGridInfo.gridWidth;
  // 一大格子中小格子数量  cellCount
  const cellCount = getGridInfo.groupGridFrame / getGridInfo.gridFrame;
  // ms/px
  const msPerPx = unref(getScaleUnit)!;
  const pxPerFullScreen = getTimeLineClipViewSize.width;
  const start = scaleStartTime.value;

  const count = pxPerFullScreen / cellWidth; // 一共需要绘制多少个小格子
  const msPerGrid = cellWidth * cellCount * msPerPx;
  const msPerCell = cellWidth * msPerPx;
  // 开始时间和下一个整格的时间间隔  cellWidth * msPerPx
  const msOffset = start % msPerCell ? msPerCell - (start % msPerCell) : 0;
  // 开始时间和下一小格的像素间隔
  const pxOffset = (msOffset / msPerCell) * cellWidth;

  // 开始绘制
  ctx.value.beginPath();
  ctx.value.clearRect(0, 0, scaleCanvasRef.value.width, scaleCanvasRef.value.height);
  ctx.value.fillStyle = '#fff';
  for (let index = 0; index < count; index++) {
    const x = index * cellWidth + pxOffset; // 刻度水平位置，绘制的时候，需要按刻度规则整点绘制，所以如果有设置开始时间的话，需要找到他的下一个整点时间进行绘制，下一个整点位置是pxOffset, 整点时间是start + msOffset
    ctx.value.moveTo(x, 8 + 20);
    const curTime = start + msOffset + index * msPerCell;
    // 根据开始时间，计算出其距离下一个大格子的小格数量
    const startToPreGridCount = Math.ceil((start % msPerGrid) / msPerCell);
    if ((index + startToPreGridCount) % cellCount) {
      // 绘制小格子
      ctx.value.lineTo(x, 4 + 20);
    } else {
      // 绘制大格子
      ctx.value.lineTo(x, 0 + 20);
      ctx.value.font = '10px sans-serif';
      const timeText = Mapping.timeFormat(curTime, getShareProps.fps);
      const textWidth = ctx.value.measureText(timeText).width;
      const textLeft = curTime === 0 ? 0 : textWidth / 2;
      ctx.value.fillText(timeText, x - textLeft, 15);
    }
    ctx.value.strokeStyle = '#fff';
    ctx.value.stroke();
    ctx.value.closePath();
  }
};
const scrollLeft = computed(() => {
  return getScrollInfo.x > Number(getShareProps.leftOffset) ? getScrollInfo.x - Number(getShareProps.leftOffset) : 0;
});
watch(scrollLeft, left => {
  scaleStartTime.value = left * unref(getScaleUnit);
  nextTick(() => {
    drawScale();
  });
});
const createHDCanvas = canvas => {
  const dpr = window.devicePixelRatio || 1;
  const { width, height } = timeLineScaleRef.value.getBoundingClientRect();
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const context = canvas.getContext('2d');
  context.scale(dpr, dpr);
  ctx.value = scaleCanvasRef.value.getContext('2d');
};
watch(getScaleUnit, () => {
  drawScale();
});
watch(
  [getMaxFrameWidth, getMinFrameWidth],
  () => {
    getShareEmits.onTimeLineScaleMarksRangeChange &&
      getShareEmits.onTimeLineScaleMarksRangeChange([], {
        maxFrameWidth: getMaxFrameWidth.value,
        minFrameWidth: getMinFrameWidth.value
      });
  },
  {
    immediate: true
  }
);
useResizeObserver(timeLineScaleRef, () => {
  createHDCanvas(scaleCanvasRef.value);
  drawScale();
});
onMounted(() => {
  nextTick(() => {
    createHDCanvas(scaleCanvasRef.value);
    zoomFit();
  });
});
</script>
<style scoped lang="scss">
.timeLine-scale-container {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  z-index: 9;
}
</style>
