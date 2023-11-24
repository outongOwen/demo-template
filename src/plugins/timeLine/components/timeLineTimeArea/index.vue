<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->
<template>
  <div ref="timeLineRuleRef" class="w100% color-#fff pr-8px" :style="{ height: timeAreaHeight + 'px' }">
    <canvas ref="ruleRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
import { consola } from 'consola';
import { useGlobalStore } from '@/store';
import { useTimeLineContext } from '../../contexts';
// eslint-disable prettier/prettier
// 约定：带cell单词的代表小格子，grid代表一大格子。
import { fpsRules, DURATION_BOUNDARY, MAX_WIDTH_PER_BIG_GRID, MIN_WIDTH_PER_BIG_GRID } from './const';
import { formatTime } from './util';

defineOptions({
  name: 'TimeLineRule'
});

const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { timeAreaHeight } = toRefs(timeLineContext);
const globalStore = useGlobalStore();
consola.log('globalStore: ', globalStore);
const props = defineProps({
  fps: {
    // 配置帧率
    type: Number,
    default: 25
  }
});
const ruleRef = ref(); // canvasDom
const timeLineRuleRef = ref(); // 刻度尺容器ref
const ctx = ref(); // canvas上下文对象
const state: any = reactive({
  curFpsRule: [],
  ruleStartTime: 0,
  currentRule: { gridValue: 15, cellCount: 10, unit: 'f', msPerCell: 1 }, // 当前匹配的刻度尺渲染的刻度规则----动态
  msPerFullScreen: 0, // 动态
  slideKey: [], // slider点击加减的时候的关键点。 // 动态
  ruleScope: [], // 刻度范围列表。 // 动态
  scaleCount: 1, // 动态
  pxPerMsInBaseRule: 1,
  trackDuration: 1 * 60 * 1000 + 5 * 1000,
  pxPerFullScreen: 800, // px
  cacheDrawParams: {
    cellWidth: 0,
    cellCount: 0,
    msPerPx: 0
  },
  videoWidth: 100,
  prePxPerFullScreen: 100
});

/**
 * 根据帧率获取当前帧率下的帧级刻度规则
 */
const getCurFpsRule = () => {
  state.curFpsRule = fpsRules[props.fps].map((item: any) => {
    item.msPerCell = ((1000 / props.fps) * item.gridValue) / item.cellCount;
    return item;
  });
};

/**
 * desc 绘制刻度
 * 一小格的宽度px cellWidth
 * 一大格子中小格子数量  cellCount
 * 一小格时长或者  ms/px  msPerPx
 * 轨道长度 px  pxPerFullScreen
 * 开始时间(ms) start
 * 指针位置 referencePoint 参考缩放点，ms, 每次缩放后，拿当前时间点和屏幕中间位置进行比较，如果超过中间位置，则重新计算开始结束位置，并调用drawRule方法。其实就是当前时间。
 *
 *  */

const drawRule = ({
  cellWidth = 50,
  cellCount = 10,
  msPerPx = 40,
  pxPerFullScreen = 1000,
  start = 0,
  referencePoint = 0
}) => {
  const duration = pxPerFullScreen * msPerPx; // 计算出当前要绘制多少ms刻度
  // 这里是做缩放使用，如果指针在屏幕右侧，则以指针为中心进行缩放。
  // TODO 有个交互问题，缩放的时候，是刻度尺控制缩放后通知轨道还是轨道控制通知刻度尺绘制。
  if (referencePoint > duration / 2 + start) {
    const newStart = referencePoint - duration / 2;
    drawRule({ cellWidth, cellCount, msPerPx, pxPerFullScreen, start: newStart, referencePoint });
    return;
  }

  const count = pxPerFullScreen / cellWidth; // 一共需要绘制多少个小格子
  const msPerGrid = cellWidth * cellCount * msPerPx;
  const msPerCell = cellWidth * msPerPx;
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
    const curTime = start + msOffset + index * (cellWidth * msPerPx);
    // 根据开始时间，计算出其距离下一个大格子的小格数量
    const startToPreGridCount = Math.ceil((start % msPerGrid) / (cellWidth * msPerPx));
    if ((index + startToPreGridCount) % cellCount) {
      // 绘制小格子
      ctx.value.lineTo(x, 4 + 20);
    } else {
      // 绘制大格子
      ctx.value.lineTo(x, 0 + 20);
      ctx.value.font = '10px sans-serif';
      const unit = msPerGrid >= 1000 ? 's' : 'f';
      const timeText = formatTime(curTime, props.fps, unit);
      const textWidth = ctx.value.measureText(timeText).width;
      const textLeft = timeText === '00:00' ? 0 : textWidth / 2;
      ctx.value.fillText(timeText, x - textLeft, 15);
    }
    ctx.value.strokeStyle = '#ffd';
    ctx.value.stroke();
    ctx.value.closePath();
  }
};

const curScale = ref(0);
const baseRule = ref({
  // 参考刻度尺，缩放到最大的时候的刻度尺，基于此时的刻度进行缩放变化。
  gridValue: 0,
  cellCount: 0,
  unit: ''
});
const ruleLists: any = reactive([]);
/**
 * 根据帧率以及轨道时长，得到缩放到最大的时候的刻度规则
 */
const caclInitRule = () => {
  if (state.trackDuration > DURATION_BOUNDARY) {
    baseRule.value = state.curFpsRule[state.curFpsRule.length - 1];
    ruleLists.push(baseRule.value);
  } else {
    baseRule.value = state.curFpsRule[0];
    ruleLists.push(...state.curFpsRule);
  }
};

const getRuleListAndSlideKey = () => {
  // 一屏幕可以显示的时间
  state.msPerFullScreen =
    (state.pxPerFullScreen / MAX_WIDTH_PER_BIG_GRID) * (1000 / props.fps) * baseRule.value.gridValue;
  // baserule下 px/ms
  state.pxPerMsInBaseRule = MAX_WIDTH_PER_BIG_GRID / (baseRule.value.gridValue * (1000 / props.fps));
  // 可点击的缩放次数，保证初始是0，元素占轨道的一半，缩放到最大，显示initRule ,求缩放次数：msPerFullScreen*2^scaleCountInt-1 = props.trackDuration;
  state.scaleCount = Math.log2(state.trackDuration / state.msPerFullScreen) + 1;

  const scaleCountInt = Math.ceil(state.scaleCount); // 可点击的缩放次数取整
  // consola.error('scaleCountInt: ', scaleCountInt, state.scaleCount);
  // 这里根据屏幕大小、轨道时间，可以知道缩放的范围，从0-n进行缩放；知道放大到最大的时候，最小一格是多少像素，多少时间。反过来进行缩小。假如n = 10,如果n = 9,代表 2^9 / 2^10 = 1/2 代表轨道缩小1倍. currentMsPerPx = msPerPx*2;  currentMsPerPx = msPerPx/(Math.pow(2, sliderValue)/ Math.pow(2, scaleCountInt))

  // 根据n 来计算 轨道上每次缩放显示的刻度
  let sliderSSCount = scaleCountInt - ruleLists.length + 1; // s应该显示的刻度数量
  consola.log('sliderSSCount: ', sliderSSCount);

  // const arrs = [1, 2, 3, 5, 10, 30, 1 * 60, 2 * 60, 3 * 60, 5 * 60, 10 * 60, 30 * 60, 1 * 60 * 60, 2 * 60 * 60, 3 * 60 * 60, 5 * 60 * 60, 10 * 60 * 60, 30 * 60 * 60] // 单位s
  const secondEnums = [1, 2, 3, 5, 10, 20, 30];
  sliderSSCount++; // 加上了20，执行这个，如果不加20，不执行。
  for (let index = 0; index < sliderSSCount; index++) {
    const item = {
      gridValue: secondEnums[index % secondEnums.length] * 60 ** Math.floor(index / secondEnums.length),
      cellCount: 10,
      unit: 's',
      msPerCell: 1
    };
    item.msPerCell = (item.gridValue * 1000) / 10;
    ruleLists.push(item);
  }
  consola.log('ruleLists--->', ruleLists);
  consola.log('state.scaleCount: ', state.scaleCount);

  for (let i = 0; i < Math.ceil(state.scaleCount); i++) {
    state.slideKey.push(Math.floor(Math.round(100 - (1 / state.scaleCount) * i * 100)) / 100);
  }
  if (state.scaleCount !== Math.ceil(state.scaleCount)) {
    state.slideKey.push(0);
  }
  consola.log('state.slideKey: ', state.slideKey);
};

/**
 * 根据得到的刻度列表ruleLists及缩放的最小范围，计算刻度缩放的边界值，得到一组范围，缩放值匹配到范围，应用对应的轨道刻度
 */
const getRuleScope = () => {
  let maxValue = 1;
  ruleLists.forEach((item: any, index: number) => {
    let minValue = 0;
    for (let i = 1; i > 0; i -= 0.01) {
      const pw = (1 - i) / (1 / state.scaleCount); // 取2的次幂，缩放的时候，按2的次幂进行缩放。
      const gridWidth = (state.pxPerMsInBaseRule * item.msPerCell * item.cellCount) / 2 ** pw;
      if (gridWidth < MIN_WIDTH_PER_BIG_GRID) {
        minValue = i + 0.01;
        break;
      }
    }
    state.ruleScope.push({
      min: index === ruleLists.length - 1 ? 0 : Math.round(minValue * 100) / 100,
      max: Math.round(maxValue * 100) / 100
    });
    maxValue = minValue - 0.01 < 0 ? 0 : minValue;
  });
  consola.error('ar---->r', state.ruleScope);
};

/**
 *轨道缩放触发轨道刻度绘制更新
 * @param val 缩放值，范围0-1
 */
const changeScale = (val: number) => {
  const index = state.ruleScope.findIndex((item: any) => {
    return item.min <= val && val <= item.max;
  });

  const pw = (1 - val) / (1 / state.scaleCount);
  const cellWidth = (state.pxPerMsInBaseRule * ruleLists[index].msPerCell) / 2 ** pw;
  const cellCount = ruleLists[index].cellCount;
  const msPerPx = ruleLists[index].msPerCell / cellWidth;
  // eslint-disable-next-line prettier/prettier
  state.currentRule = ruleLists[index];
  state.cacheDrawParams = { cellWidth, cellCount, msPerPx };
  drawRule({ cellWidth, cellCount, msPerPx, pxPerFullScreen: state.pxPerFullScreen });
  state.videoWidth = (state.trackDuration / ruleLists[index].msPerCell) * cellWidth; // 更新视频宽度
};
const caclCanvasSize = () => {
  const { width, height } = timeLineRuleRef.value.getBoundingClientRect();
  // 设置画布宽高为外层元素宽高
  ruleRef.value.width = width;
  ruleRef.value.height = height;
  state.prePxPerFullScreen = state.pxPerFullScreen;
  state.pxPerFullScreen = ruleRef.value.width;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateScale = () => {
  let index = ruleLists.findIndex((item: any) => {
    return item.gridValue === state.currentRule.gridValue && item.unit === state.currentRule.unit;
  });
  if (index < 0) {
    index = state.currentRule.unit === 'f' ? 0 : ruleLists.length - 1;
  }
  consola.log('index: ', index);
  const pw = Math.log2((state.pxPerMsInBaseRule * ruleLists[index].msPerCell) / state.cacheDrawParams.cellWidth);
  let val = 1 - pw * (1 / state.scaleCount);
  consola.error('pw: ', pw, val);
  if (val > 1) {
    val = 1;
  } else if (val < 0) {
    val = 0;
  }
  curScale.value = val;
};
const updateTimeRule = () => {
  ruleLists.splice(0, ruleLists.length);
  state.slideKey = [];
  state.ruleScope = [];
  caclCanvasSize(); // 轨道dom尺寸变化，影响绘制
  caclInitRule(); // 轨道时长变化，影响绘制
  getRuleListAndSlideKey(); // 根据最新的轨道尺寸及轨道时长，得到最新的刻度列表及关键缩放点列表。
  getRuleScope(); // 得到刻度列表对应的缩放范围
};
// 监听globalStore中duration变化，如果有变化，更新刻度规则
/* watch(
  () => globalStore,
  () => {
    state.trackDuration = state.trackDuration > 10 * 60 * 1000 ? 5 * 60 * 1000 : 20 * 60 * 1000;
    updateTimeRule();
    updateScale(); // 更新slider上的缩放值
    const params = { ...state.cacheDrawParams, pxPerFullScreen: state.pxPerFullScreen };
    drawRule(params); // 使用缓存的刻度进行绘制
  }
); */
useResizeObserver(timeLineRuleRef, () => {
  // 浏览器缩放，更新刻度规则
  caclCanvasSize(); // 轨道dom尺寸变化，影响绘制
  updateTimeRule(); // 获取最新的刻度规则
  updateScale(); // 更新slider上的缩放值
  const params = { ...state.cacheDrawParams, pxPerFullScreen: state.pxPerFullScreen };
  drawRule(params); // 使用缓存的刻度进行绘制
});
onMounted(() => {
  ctx.value = ruleRef.value.getContext('2d');
  getCurFpsRule();
  updateTimeRule();
  changeScale(curScale.value); // 刚进入的时候，默认缩放0，
  /**
   * 轨道绘制中考虑如下功能
   * 1、轨道时长更新的时候，当前刻度状态不变，只是改变的slider上scale的值，
   * 2、轨道长度改变的时候，当前刻度状态不变，只改变slider上scale的值。
   * 目前对上面2点的处理是：缓存之前绘制的刻度，更新轨道时长和长度的时候，计算出最新的规则，然后反推之前轨道的缩放对应最新规则的缩放值。等待下一次主动操作缩放的时候，使用最新的规则即可。所以传出去的 msPerPx，应该是缓存的mePerPx.
   */
  /**
   * 和外面的数据交互
   * 需要通知外部 ms/px， 以及通过绘制的开始结束时间，得到开始前后有多少px
   */
});
</script>
<style scoped></style>
