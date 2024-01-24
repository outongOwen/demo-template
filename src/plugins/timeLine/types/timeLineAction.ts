/**
 * 动作的基本参数
 * @export
 * @interface TimelineAction
 */
export interface TimelineAction {
  /** 动作id */
  id: string;
  /** 动作类型 */
  type: string;
  /** 动作开始时间 */
  start: number;
  /** 动作结束时间 */
  end: number;
  /** 动作所对应的effectId */
  effectId: string;
  /** 动作名称 */
  name?: string;
  /** 动作是否可以选中 */
  selected?: boolean;
  /** 动作是否可伸缩 */
  flexible?: boolean;
  /** 动作是否可移动 */
  movable?: boolean;
  /** 动作是否禁止运行 */
  disable?: boolean;
}
