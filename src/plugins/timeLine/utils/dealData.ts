import type { TimelineAction } from '../types';
/**
 * @description 时间 转 px
 * @param params {left,width}
 * @param scaleUnit
 * @returns {left,width}
 */
export function parserTimeToTransform(
  params: {
    start: number;
    end: number;
  },
  scaleUnit: number
): { left: number; width: number } {
  const { start, end } = params;
  return {
    left: start / scaleUnit,
    width: (end - start) / scaleUnit
  };
}
/**
 * @description px转时间
 * @param data {width,left}
 *  @param scaleUnit
 * @returns {start,end}
 */
export function parserTransformToTime(
  params: {
    left: number;
    width: number;
  },
  scaleUnit: number
): { start: number; end: number } {
  const { left, width } = params;
  return {
    start: left * scaleUnit,
    end: (left + width) * scaleUnit
  };
}
/**
 *  @description 获取动作全部时间的位置集合
 * @param actions
 * @param scaleUnit
 * @returns  positions
 */
export function parserActionsToPositions(actions: TimelineAction[], scaleUnit: number): number[] {
  const positions: number[] = [];
  actions.forEach(item => {
    positions.push(item.start / scaleUnit);
    positions.push(item.end / scaleUnit);
  });
  return positions;
}
