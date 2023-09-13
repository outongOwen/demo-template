/** 时间线侧边栏 */
export interface TimeLineBar {
  /** 时间线侧边栏css宽度 */
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}
/**
 * @abstract 时间线侧边栏每一项
 */
export interface TimeLineBarAction {
  /** 锁定行 */
  lockedRow?: boolean;
  /** 隐藏行 */
  hidedRow?: boolean;
  /** 静音 */
  muted?: boolean;
}
