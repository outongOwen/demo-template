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
    start: Math.round(left * scaleUnit),
    end: Math.round((left + width) * scaleUnit)
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
  positions.sort((a, b) => a - b);
  return positions;
}

/**
 * @description 检查是否存在交集，通过目标action与actions，通过属性start和end判断
 * @param {TimelineAction} targetAction
 * @param {TimelineAction[]} actions
 * @returns {boolean}
 */
export function checkIntersectionTime(
  { targetStart, targetEnd, targetId }: { targetStart: number; targetEnd: number; targetId: string },
  actions: TimelineAction[]
): boolean {
  const filterActions = actions.filter(action => action.id !== targetId);
  return filterActions.some(action => {
    const { start, end } = action;
    if (targetStart > start && targetStart < end) {
      return true;
    }
    if (targetEnd > start && targetEnd < end) {
      return true;
    }
    if (targetStart < start && targetEnd > end) {
      return true;
    }
    return false;
  });
}
