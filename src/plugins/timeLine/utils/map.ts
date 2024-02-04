import _ from 'lodash';
import type { SCALE_GRID_SEGMENT_ITEM, TimelineAction, TimelineRow } from '../types';
import { GET_SCALE_GRID_SEGMENT } from '../const';

const second2hms = second => {
  const h = Math.floor(second / 3600) >= 10 ? String(Math.floor(second / 3600)) : `0${Math.floor(second / 3600)}`;
  const m =
    Math.floor((second / 60) % 60) >= 10
      ? String(Math.floor((second / 60) % 60))
      : `0${Math.floor((second / 60) % 60)}`;
  const s = Math.floor(second % 60) >= 10 ? String(Math.floor(second % 60)) : `0${Math.floor(second % 60)}`;

  return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
};
/**
 * 时间格式化
 */
const timeFormat = (time, fps) => {
  const frames = Math.round(time / (1000 / fps));
  return frames % fps === 0 ? second2hms(frames / fps) : `${frames % fps}f`;
};
/**
 * 格子渲染器需要把帧，渲染为格子：
 * @param {number} frameWidth 帧宽度
 * @returns {Object}
 *  result.gridWidth 格子宽度
 *  result.gridFrame 格子所包含的帧数
 *  result.groupGridFrame 格子组所包含的帧数
 */
const frameWidth2Grid = (frameWidth: number, fps: number) => {
  // 常量，用于表明渲染分段函数
  const gridSegmentList = GET_SCALE_GRID_SEGMENT.get(fps);
  // 临时变量，用于存储函数结果
  let tempGridSegment: SCALE_GRID_SEGMENT_ITEM | null = null;
  // 遍历常量，查找 frameWidth 所在的分段函数
  for (const gridSegment of gridSegmentList!) {
    if (frameWidth <= gridSegment.maxWidth && frameWidth > gridSegment.minWidth) {
      tempGridSegment = gridSegment;
      break;
    }
  }
  if (!tempGridSegment) {
    throw new Error('Please input frameWidth in [0,200]');
  }
  return {
    gridWidth: tempGridSegment.gridFrame * frameWidth,
    gridFrame: tempGridSegment.gridFrame,
    groupGridFrame: tempGridSegment.groupGridFrame
  };
};

// /**
//  * 时间轴总格数
//  * input @帧宽度 frameWidth
//  * input @时间轴宽度 timeLineWidth
//  * input @素材最大时刻 materialMaxFrame
//  * output @时间轴格子数量 girdTotalNumber
//  */
// const getGridTotalNumber = (frameWidth, timeLineWidth, materialMaxFrame) => {
//   // 格宽度
//   const gridWidth = frameWidth2Grid(frameWidth).gridWidth;

//   // 计算一屏幕有多少格
//   const oneScreenGridNumber = Math.floor(timeLineWidth / gridWidth);

//   // 计算空白处有多少格
//   const emptyScreenGridNumber = Math.floor(oneScreenGridNumber / 3);

//   // 计算素材有多少格
//   const materialGridNumber = (materialMaxFrame, frameWidth, gridWidth) => {
//     // 素材宽度
//     const materialWidth = materialMaxFrame * frameWidth;
//     // 素材格数（向上取整）
//     const materialGridNumber = Math.ceil(materialWidth / gridWidth);
//     return materialGridNumber;
//   };

//   // 总格数
//   const gridTotalNumber = emptyScreenGridNumber + materialGridNumber(materialMaxFrame, frameWidth, gridWidth);

//   return gridTotalNumber;
// };

// /**
//  * 时间刻度总宽度
//  * input @帧宽度 frameWidth
//  * input @时间轴宽度 timeLineWidth
//  * input @素材最大时刻 materialMaxFrame
//  * output @时间轴格子数量 girdTotalNumber
//  */
// const getTimeScaleWidth = (frameWidth, timeLineWidth, materialMaxFrame) => {
//   // 格宽度
//   const gridWidth = frameWidth2Grid(frameWidth).gridWidth;

//   // 总格数
//   const gridTotalNumber = getGridTotalNumber(frameWidth, timeLineWidth, materialMaxFrame);

//   const result = gridTotalNumber * gridWidth;
//   return timeLineWidth >= result ? timeLineWidth : result;
// };

const getTimeScalePlaceHolderWidth = (offsetLeft, gridWidth) => Math.floor(offsetLeft / gridWidth) * gridWidth;

// 当前绘制的是第几个格子
const gridBufferFirstIndex = (offsetLeft, gridWidth) => {
  const placeholderWidth = Math.floor(offsetLeft / gridWidth) * gridWidth;
  return Math.floor(placeholderWidth / gridWidth) + 1;
};

// 格子缓存数量
const getGridBufferNumber = (timeLine_width, gridWidth) => Math.ceil(timeLine_width / gridWidth) + 1;

/**
 * 渲染格子
 * @param {ref<List>} gridBufferList 最终要渲染的 GridBufferList
 * @param {*} gridWidth 每个格子的宽度
 * @param {number} groupGridFrame 每个 GridGroup 里包含多少 Frame
 * @param {number} gridFrame 每个 Grid 里包含多少 Frame
 * @param {width} timeLineOffsetLeft 时间轴的左偏移量
 * @param {*} timescale_width 时间轴的实际宽度（不是显示宽度）
 */
const renderGridBufferList = (
  gridBufferList,
  options: {
    gridWidth: number;
    groupGridFrame: number;
    gridFrame: number;
    offsetLeft: number;
    timeLineWidth: number;
  }
) => {
  try {
    const { gridWidth, groupGridFrame, gridFrame, offsetLeft, timeLineWidth } = options;
    // 获取格子倍数；例如：2 倍，就是 2 的倍数都会绘制大格
    const gridMultiple = groupGridFrame / gridFrame;
    // 初始位置
    const firstIndex = gridBufferFirstIndex(offsetLeft, gridWidth);

    // 结束位置
    const gridBufferNumber = getGridBufferNumber(timeLineWidth, gridWidth);

    // 动态计算数组长度
    if (gridBufferNumber > gridBufferList.value.length) {
      const dValue = gridBufferNumber - gridBufferList.value.length;
      for (let i = 1; i <= dValue; i++) {
        gridBufferList.value.push({
          frame: 0,
          showNumber: false,
          width: 0
        });
      }
    } else if (gridBufferNumber < gridBufferList.value.length) {
      const dValue = gridBufferList.value.length - gridBufferNumber;
      gridBufferList.value.splice(gridBufferList.value.length - dValue, dValue);
    } else {
      // doing nothing
    }

    // 渲染过程
    for (let i = firstIndex; i <= gridBufferNumber + firstIndex - 1; i++) {
      const grid = gridBufferList.value[i - firstIndex];
      if (i - 1 === 0) {
        grid.frame = 0;
        grid.showNumber = true;
        grid.width = gridWidth;
      } else if ((i - 1) % gridMultiple === 0) {
        grid.frame = (i - 1) * gridFrame;
        grid.showNumber = true;
        grid.width = gridWidth;
      } else {
        grid.frame = (i - 1) * gridFrame;
        grid.showNumber = false;
        grid.width = gridWidth;
      }
    }
  } catch (error) {
    // doing nothing
    // console.log(error);
  }
};

/**
 * 获取时间轴最小帧宽度
 * @param {number} maxMaterialFrame 时间轴上素材的最大帧数，单位 frame
 * @param {number} timeLineWidth 时间轴的长度，单位 px
 * @returns
 */
const getMinFrameWidth = (maxMaterialFrame, timeLineWidth) => {
  const maxMaterialFrameWidth = timeLineWidth * (1 / 3);
  return maxMaterialFrameWidth / maxMaterialFrame;
};

/**
 * 获取时间轴合适帧宽度
 * 常量：200px
 */
const getMaxFrameWidth = () => 200;

/**
 * 获取时间轴合适帧宽度
 * @param {number} maxMaterialFrame
 * @param {number} timeLineWidth
 * @returns
 */
const getFitFrameWidth = (maxMaterialFrame, timeLineWidth) => {
  const maxMaterialFrameWidth = timeLineWidth * (4 / 5);
  return maxMaterialFrameWidth / maxMaterialFrame;
};

/**
 * 微秒转帧数
 * @param {*} μs 需要转换的微秒数
 * @param {number} fps 帧率
 * @returns 帧数
 */
const μs2Frame = (μs, fps) => Math.round(μs * (fps / 1000000));

/**
 * 毫秒转帧数
 * @param {*} ms
 * @param {*} fps
 * @returns
 */
const ms2Frame = (ms, fps) => Math.round(ms * (fps / 1000));

/**
 * 帧数转毫秒
 * @param {*} frame
 * @param {*} fps
 */
const frame2ms = (frame, fps) => (frame / fps) * 1000;

// /**
//  * 获取时间轴上，视觉素材的宽度
//  * @param {number} timelineIn 素材在时间轴上的入点
//  * @param {*} timelineOut 素材在时间轴上的出点
//  * @param {*} frameWidth 帧宽度
//  * @returns
//  */
// const getMaterialWidth = (timelineIn, timelineOut, frameWidth, fps) =>
//   μs2Frame(timelineOut - timelineIn, fps) * frameWidth;

/**
 *  获取当前最大的素材占据的帧
 * @param {Object} coreData 核心数据
 */
// TODO 本函数目前仅仅计算了视频中的最大素材，实际上应该计算全部素材的最大素材
const getMaxFrameNumbers = (editorData: Array<TimelineRow>, fps) => {
  const endTime = editorData.reduce((prev, cur) => {
    // 通过actions中最大end值计算最大宽度
    const maxTime = cur.actions.reduce((aPrev: number, aCur: TimelineAction) => {
      return Math.max(aPrev, aCur.end);
    }, 0);
    return Math.max(prev, maxTime);
  }, 0);
  return endTime ? μs2Frame(endTime * 1000, fps) : 0;
};

export default {
  frameWidth2Grid,
  getTimeScalePlaceHolderWidth,
  gridBufferFirstIndex,
  renderGridBufferList,
  getMinFrameWidth,
  getMaxFrameWidth,
  getFitFrameWidth,
  μs2Frame,
  ms2Frame,
  frame2ms,
  second2hms,
  timeFormat,
  getMaxFrameNumbers
  // calcTimeLineContainerWidth,
  // getMaterialWidth,
  // getGridTotalNumber,
  // getTimeScaleWidth,
  // getVideoTrackMaterialList,
};
