import type { TimelineAction, TimelineRow } from '../../../types';
/**
 * @description 判断当前action与row中action的start和end是否有重叠
 * @param {TimelineRow} action
 * @param {TimelineRow} row
 * @returns {boolean}
 */
export function isActionOverlap(action: TimelineAction, row: TimelineRow): boolean {
  if (!action || !row) return false;
  const { start, end } = action;
  const { actions } = row;
  if (!actions || !actions.length) return false;
  return actions.some(item => {
    if (item.id === action.id) return false;
    const { start: s, end: e } = item;
    return (start >= s && start <= e) || (end >= s && end <= e) || (s >= start && s <= end) || (e >= start && e <= end);
  });
}
