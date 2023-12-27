import { useResizeObserver } from '@vueuse/core';
import type { MaybeElementRef } from '@vueuse/core';
import { isNumber } from 'lodash';
import { useTimeLineStore } from '@/store';
import { mockData } from '../mock';
// 约定：带cell单词的代表小格子，grid代表一大格子。
import { fpsRules, DURATION_BOUNDARY, MAX_WIDTH_PER_BIG_GRID, MIN_WIDTH_PER_BIG_GRID } from './const';
export default function useTrackScale(timeLineMainWrapRef: MaybeElementRef, sideBarWidth: number, fps: number): void {
  // 需要通过刻度尺宽度和时长来计算
  const timeLineStore = useTimeLineStore();
  const { getScaleInfo } = timeLineStore;

  const scaleWidth = ref(1000); // 刻度尺宽度
  interface StateType {
    curFpsRule: Array<object>;
    currentRule: { gridValue: number; cellCount: number; unit: string; msPerCell: number }; // 当前匹配的刻度尺渲染的刻度规则----动态
    sliderKeys: Array<number>; // slider点击加减的时候的关键点。 // 动态
    ruleScope: Array<object>; // 刻度范围列表。 // 动态
    scaleCount: number; // 动态
    pxPerMsInBaseRule: number;
    preScaleSmallCellWidth: number; // 缓存的最小格宽度
    scaleSmallCellWidth: number;
    scaleLargeCellWidth: number;
    scaleSmallCellMs: number;
  }
  const state: StateType = reactive({
    curFpsRule: [],
    currentRule: { gridValue: 15, cellCount: 10, unit: 'f', msPerCell: 1 }, // 当前匹配的刻度尺渲染的刻度规则----动态
    sliderKeys: [], // slider点击加减的时候的关键点。 // 动态
    ruleScope: [], // 刻度范围列表。 // 动态
    scaleCount: 1, // 动态
    pxPerMsInBaseRule: 1,
    preScaleSmallCellWidth: 1,
    scaleSmallCellWidth: 10,
    scaleLargeCellWidth: 50,
    scaleSmallCellMs: 20
  });

  const curScale = ref(0);
  const baseRule: any = ref({
    // 参考刻度尺，缩放到最大的时候的刻度尺，基于此时的刻度进行缩放变化。
    gridValue: 0,
    cellCount: 0,
    unit: ''
  });
  const ruleLists: any = reactive([]);
  /**
   * @description 轨道素材总时长
   */
  const trackDuration = computed(() => {
    const editorData = mockData;
    const max = editorData.reduce((prev, cur) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const maxEnd = cur.actions.reduce((prev: any, cur: any) => {
        return Math.max(prev, cur.end);
      }, 0);

      return Math.max(prev, maxEnd);
    }, 0);
    return max;
  });

  /**
   * description 根据帧率获取当前帧率下的帧级刻度规则
   */
  const getCurFpsRule = () => {
    state.curFpsRule = fpsRules[fps].map((item: any) => {
      item.msPerCell = ((1000 / fps) * item.gridValue) / item.cellCount;
      return item;
    });
    // console.error('state.curFpsRule: ', state.curFpsRule);
  };
  /**
   * description 根据帧率以及轨道时长，得到缩放到最大的时候的刻度规则
   */
  const caclInitRule = () => {
    if (trackDuration.value > DURATION_BOUNDARY) {
      baseRule.value = state.curFpsRule[state.curFpsRule.length - 1];
      ruleLists.push(baseRule.value);
    } else {
      baseRule.value = state.curFpsRule[0];
      ruleLists.push(...state.curFpsRule);
    }
  };

  const getRuleListAndSlideKey = () => {
    // 一屏幕可以显示的时间
    const msPerFullScreen = (scaleWidth.value / MAX_WIDTH_PER_BIG_GRID) * (1000 / fps) * baseRule.value.gridValue;
    // baserule下 px/ms
    state.pxPerMsInBaseRule = MAX_WIDTH_PER_BIG_GRID / (baseRule.value.gridValue * (1000 / fps));
    // 可点击的缩放次数，保证初始是0，元素占轨道的一半，缩放到最大，显示initRule ,求缩放次数：msPerFullScreen*2^scaleCountInt-1 = props.trackDuration.value;
    state.scaleCount = Math.log2(trackDuration.value / msPerFullScreen) + 1;

    const scaleCountInt = Math.ceil(state.scaleCount); // 可点击的缩放次数取整
    // consola.error('scaleCountInt: ', scaleCountInt, state.scaleCount);
    // 这里根据屏幕大小、轨道时间，可以知道缩放的范围，从0-n进行缩放；知道放大到最大的时候，最小一格是多少像素，多少时间。反过来进行缩小。假如n = 10,如果n = 9,代表 2^9 / 2^10 = 1/2 代表轨道缩小1倍. currentMsPerPx = scaleUnit*2;  currentMsPerPx = scaleUnit/(Math.pow(2, sliderValue)/ Math.pow(2, scaleCountInt))

    // 根据n 来计算 轨道上每次缩放显示的刻度
    let sliderSSCount = scaleCountInt - ruleLists.length + 1; // s应该显示的刻度数量
    // consola.log('sliderSSCount: ', sliderSSCount);

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
      item.msPerCell = (item.gridValue * 1000) / item.cellCount;
      ruleLists.push(item);
    }
    // consola.log('ruleLists--->', ruleLists);
    // consola.log('state.scaleCount: ', state.scaleCount);

    for (let i = 0; i < Math.ceil(state.scaleCount); i++) {
      state.sliderKeys.unshift(Math.floor(Math.round(100 - (1 / state.scaleCount) * i * 100)) / 100);
    }
    if (state.scaleCount !== Math.ceil(state.scaleCount)) {
      state.sliderKeys.unshift(0);
    }
    // consola.log('state.sliderKeys: ', state.sliderKeys);
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
    // consola.error('ar---->r', state.ruleScope);
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
    state.scaleSmallCellWidth = (state.pxPerMsInBaseRule * ruleLists[index].msPerCell) / 2 ** pw;
    state.scaleLargeCellWidth = state.scaleSmallCellWidth * ruleLists[index].cellCount;
    state.scaleSmallCellMs = ruleLists[index].msPerCell;
    // eslint-disable-next-line prettier/prettier
    state.currentRule = ruleLists[index];
    // console.log(
    //   'state.scaleSmallCellWidth: ',
    //   state.scaleSmallCellWidth,
    //   state.scaleLargeCellWidth,
    //   state.scaleSmallCellMs,
    //   state.currentRule
    // );
  };
  const updateScale = () => {
    let index = ruleLists.findIndex((item: any) => {
      return item.gridValue === state.currentRule.gridValue && item.unit === state.currentRule.unit;
    });
    if (index < 0) {
      index = state.currentRule.unit === 'f' ? 0 : ruleLists.length - 1;
    }
    const pw = Math.log2((state.pxPerMsInBaseRule * ruleLists[index].msPerCell) / state.preScaleSmallCellWidth);
    let val = 1 - pw * (1 / state.scaleCount);
    // consola.error('pw: ', pw, val);
    if (val > 1) {
      val = 1;
    } else if (val < 0) {
      val = 0;
    }
    curScale.value = val;
    timeLineStore.setScaleInfo({ scale: unref(curScale), sliderKeys: state.sliderKeys });
  };
  const caclScale = () => {
    state.sliderKeys = [];
    state.ruleScope = [];
    getCurFpsRule();
    caclInitRule(); // 轨道时长变化，影响绘制
    getRuleListAndSlideKey(); // 根据最新的轨道尺寸及轨道时长，得到最新的刻度列表及关键缩放点列表。
    getRuleScope(); // 得到刻度列表对应的缩放范围
  };
  const updateTimeRule = () => {
    ruleLists.splice(0, ruleLists.length);
    state.sliderKeys = [];
    state.ruleScope = [];
    caclInitRule(); // 轨道时长变化，影响绘制
    getRuleListAndSlideKey(); // 根据最新的轨道尺寸及轨道时长，得到最新的刻度列表及关键缩放点列表。
    getRuleScope(); // 得到刻度列表对应的缩放范围
  };
  watch(
    () => getScaleInfo.scale,
    val => {
      if (val === curScale.value) return;
      if (isNumber(val)) {
        curScale.value = val;
        changeScale(val);
      }
      timeLineStore.setScaleInfo({
        scaleSmallCellWidth: state.scaleSmallCellWidth,
        scaleLargeCellWidth: state.scaleLargeCellWidth,
        scaleSmallCellMs: state.scaleSmallCellMs
      });
    }
  );
  const isFirst = ref(true);
  useResizeObserver(timeLineMainWrapRef, entries => {
    const entry = entries[0];
    const { width } = entry.contentRect;
    // console.log('width, height: ', width, height);
    scaleWidth.value = width - sideBarWidth;
    // console.error('state.scaleWidth:------++++ ', scaleWidth.value);
    if (isFirst.value) {
      isFirst.value = false;
      caclScale();
      changeScale(0);
      // slider需要使用的数据：marks, curScale; 刻度尺需要的数据，当前规则下，小格子宽度、大格子宽度、msPerPx(scaleUnit); slider缩放的时候，能更新以上信息。
      state.preScaleSmallCellWidth = state.scaleSmallCellWidth;
      timeLineStore.setScaleInfo({
        sliderKeys: state.sliderKeys,
        scaleSmallCellWidth: state.scaleSmallCellWidth,
        scaleLargeCellWidth: state.scaleLargeCellWidth,
        scaleSmallCellMs: state.scaleSmallCellMs
      });
      return;
    }
    updateTimeRule();
    updateScale();
  });
}
