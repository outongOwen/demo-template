import type { TimelineRow } from '../../types';
/**
 * @description 时间轴按照类型排序
 */

export const sortTimeLineByType = (timeLine: TimelineRow[], sortTypes: string[]) => {
  const result: TimelineRow[] = [];
  if (!timeLine.length || !sortTypes.length) return timeLine;
  sortTypes.forEach((type: string) => {
    const typeList = timeLine.filter((item: TimelineRow) => item.type === type);
    result.push(...typeList);
  });
  if (result.length === timeLine.length) {
    return result;
  }
  timeLine.forEach((item: TimelineRow) => {
    if (!result.includes(item)) {
      result.unshift(item);
    }
  });
  return result;
};
