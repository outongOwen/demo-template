import type { VNodeChild } from 'vue';
import type { TimelineRow } from './timeLineRow';

/**
 * @abstract 定制侧边栏配置选项
 */
export interface TimelineSideBar {
  /** 侧边栏标志 */
  id: string;
  /** 时间轴渲染render */
  render: (row: TimelineRow, options: any) => VNodeChild | Component;
}
