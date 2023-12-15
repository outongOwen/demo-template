import type { TimelineAction } from '../../../types';
/**
 * @description 判断开始时间和结束时间与row中action的进行碰撞检测
 * @param {number} start
 * @param {number} end
 * @param {TimelineRow} row
 * @returns {boolean}
 */
export const isActionCollision = (start: number, end: number, action: TimelineAction): boolean => {
  // 判断开始时间和结束时间与action的进行碰撞检测
  const { start: actionStart, end: actionEnd } = action;
  if (start >= actionStart && start <= actionEnd) {
    return true;
  }
  if (end >= actionStart && end <= actionEnd) {
    return true;
  }
  if (start <= actionStart && end >= actionEnd) {
    return true;
  }
  return false;
};
