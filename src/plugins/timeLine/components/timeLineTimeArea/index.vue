<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->
<template>
  <div
    ref="timeLineRuleRef"
    class="timeLine-rule-container"
    :style="{
      height: scaleHeight + 'px',
      left: `${leftOffset}px`
    }"
  >
    <canvas ref="ruleRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';

defineOptions({
  name: 'TimeLineTimeArea'
});
const { injectTimeLineContext } = useTimeLineContext();
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineContext = injectTimeLineContext();
const timeLineStateContext = injectTimeLineStateContext();
const { scaleHeight, scaleSmallCellWidth, scaleLargeCellWidth, leftOffset } = toRefs(timeLineContext);
const { getScaleRender } = timeLineContext;
const { scaleUnit, scrollInfo } = timeLineStateContext;
const ruleRef = ref(); // canvasDom
const timeLineRuleRef = ref(); // 刻度尺容器ref
const ctx = ref(); // canvas上下文对象

const state: any = reactive({
  ruleStartTime: 0,
  pxPerFullScreen: 900 // px
});
const drawRule = () => {
  // 一小格的宽度px cellWidth
  const cellWidth = unref(scaleSmallCellWidth)!;
  // 一大格子中小格子数量  cellCount
  const cellCount = Math.round(unref(scaleLargeCellWidth)! / unref(scaleSmallCellWidth)!);
  // ms/px
  const msPerPx = unref(scaleUnit)!;
  const pxPerFullScreen = state.pxPerFullScreen;
  const start = state.ruleStartTime;

  const count = pxPerFullScreen / cellWidth; // 一共需要绘制多少个小格子
  const msPerGrid = cellWidth * cellCount * msPerPx;
  const msPerCell = Math.round(cellWidth * msPerPx);
  // 开始时间和下一个整格的时间间隔  cellWidth * msPerPx
  const msOffset = start % msPerCell ? msPerCell - (start % msPerCell) : 0;
  // 开始时间和下一小格的像素间隔
  const pxOffset = (msOffset / msPerCell) * cellWidth;

  // 开始绘制
  ctx.value.beginPath();
  ctx.value.clearRect(0, 0, ruleRef.value.width, ruleRef.value.height);
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
      const unit = msPerGrid >= 1000 ? 's' : 'f';
      const timeText = getScaleRender ? getScaleRender(curTime, unit) : curTime;
      const textWidth = ctx.value.measureText(timeText).width;
      const textLeft = curTime === 0 ? 0 : textWidth / 2;
      ctx.value.fillText(timeText, x - textLeft, 15);
    }
    ctx.value.strokeStyle = '#ffd';
    ctx.value.stroke();
    ctx.value.closePath();
  }
};
const calcCanvasSize = () => {
  const { width, height } = timeLineRuleRef.value.getBoundingClientRect();
  // 设置画布宽高为外层元素宽高
  ruleRef.value.width = width;
  ruleRef.value.height = height;
  state.pxPerFullScreen = ruleRef.value.width;
};
watch(scrollInfo.x, () => {
  state.ruleStartTime = unref(scrollInfo.x) * unref(scaleUnit)!;
  drawRule();
});
watch(
  () => scaleUnit?.value,
  () => {
    drawRule();
  }
);
useResizeObserver(timeLineRuleRef, () => {
  // 浏览器缩放，更新刻度规则
  calcCanvasSize(); // 轨道dom尺寸变化，影响绘制
  drawRule();
});
onMounted(() => {
  calcCanvasSize(); // 轨道dom尺寸变化，影响绘制
  ctx.value = ruleRef.value.getContext('2d');
  drawRule();
});
</script>
<style scoped>
.timeLine-rule-container {
  position: relative;
  top: 0;
  width: 100%;
  overflow: hidden;
  z-index: 999;
}
</style>
