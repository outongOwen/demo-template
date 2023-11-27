import type { VNodeChild, CSSProperties, Component } from 'vue';
import type { ITimelineEngine } from '../core/engine';
import type { Emitter } from '../core/emitter';
import type { EventTypes } from '../core/events';
import type { TimelineEffect, TimelineAction, TimelineRow, TimelineSideBar } from '../types';

export interface EditData {
  /**
   * @description 时间轴编辑数据
   */
  editorData: TimelineRow[];
  /**
   * @description 时间轴动作效果配置
   */
  effects?: Record<string, TimelineEffect>;
  /**
   * @description 时间轴侧边栏配置
   */
  sideBars?: Record<string, TimelineSideBar>;
  /**
   * @description 时间轴行排序规则
   * @abstract 用于对行进行排序，不传则按照默认顺序排序
   * @abstract 重点提醒：如果传入该属性，那么所有行的type都必须在该数组中存在，否则会报错
   * @abstract 该属性会影响拖拽时的范围计算，如果不传则拖拽范围为全部行，如果传入该属性，则会严格按照类型行的范围进行拖拽（主轴除外）
   * @abstract 如果开启主轴，主轴可以全局拖拽，不受该属性影响
   * @example ['type1', 'type2', 'type3']
   */
  rowSortTypes?: string[];
  /**
   * @description 时间轴背景色
   * @abstract 可以通过外部背景色继承也可以配置该属性进行背景色统一配置
   */

  background?: string;
  /**
   * @description 时间轴容器左侧偏移距离
   * @type{number}
   * @default 5
   */
  leftOffset?: number;
  /**
   * @description 侧边栏宽度
   * @default 150
   */
  sideBarWidth?: number;
  /**
   * @description 每个编辑行默认高度（>0, 单位：px）
   * @default 32
   */
  rowHeight?: number;
  /**
   * @description  编辑行默认行间距
   * @default 10
   */
  rowSpacing?: number;
  /**
   *@description  时间轴背景色
   */
  rowBackground?: string;
  /**
   * @description 时间轴激活背景色
   */
  rowActiveBackground?: string;
  /**
   * @description 刻度区域高度
   * @default 50
   */
  timeAreaHeight?: number;
  /**
   * @description 是否开启主时间轴
   */
  mainRow?: boolean;
  /**
   * @description 主时间轴id  (mainRow为true时必传)
   * @abstract 有且只有一个
   */
  mainRowId?: string;

  /**
   * @description 主时间轴背景色
   */
  mainRowBackground?: string;

  /**
   * @description 单个刻度标记范畴（>0）
   * @default 1
   */
  scale?: number;
  /**
   * @description 最少刻度个数（>=1）
   * @default 20
   */
  minScaleCount?: number;
  /**
   * @description 最大刻度个数（>=minScaleCount）
   * @default Infinity
   */
  maxScaleCount?: number;
  /**
   * @description 单个刻度细分单元数（>0整数）
   * @default 10
   */
  scaleSplitCount?: number;
  /**
   * @description 单个刻度的显示宽度（>0, 单位：px）
   * @default 160
   */
  scaleWidth?: number;
  /**
   * @description 刻度开始距离左侧的距离（>=0, 单位：px）
   * @default 20
   */
  startLeft?: number;

  /**
   * @description 是否启动网格移动吸附
   * @default false
   */
  gridSnap?: boolean;
  /**
   * @description 是否开启侧边栏
   */
  showSideBar?: boolean | undefined;
  /**
   * @description 启动拖拽辅助线吸附
   * @default false
   */
  dragLine?: boolean;
  /**
   * @description 是否隐藏光标
   * @default false
   */
  hideCursor?: boolean;
  /**
   * @description 禁止全部动作区域拖动
   * @default false
   */
  disableDrag?: boolean;
  /**
   * @description timeline运行器，不传则使用内置运行器
   */

  engine?: ITimelineEngine;
  /**
   * @description 自定义action区域渲染
   */
  getActionRender?: (action: TimelineAction, row: TimelineRow) => VNodeChild | Component;
  /**
   * @description 自定义scale渲染
   */
  getScaleRender?: (scale: number) => VNodeChild | Component;
  /**
   * @description 开始移动回调
   */
  onActionMoveStart?: (params: { action: TimelineAction; row: TimelineRow }) => void;
  /**
   * @description 移动回调（return false可阻止移动）
   */
  onActionMoving?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number }) => void | boolean;
  /**
   * @description 移动结束回调（return false可阻止onChange触发）
   */
  onActionMoveEnd?: (params: { action: TimelineAction; row: TimelineRow; start: number; end: number }) => void;
  /**
   * @description 开始改变大小回调
   */
  onActionResizeStart?: (params: { action: TimelineAction; row: TimelineRow; dir: 'right' | 'left' }) => void;
  /**
   * @description 开始大小回调（return false可阻止改变）
   */
  onActionResizing?: (params: {
    action: TimelineAction;
    row: TimelineRow;
    start: number;
    end: number;
    dir: 'right' | 'left';
  }) => void | boolean;
  /**
   * @description 改变大小结束回调（return false可阻止onChange触发）
   */
  onActionResizeEnd?: (params: {
    action: TimelineAction;
    row: TimelineRow;
    start: number;
    end: number;
    dir: 'right' | 'left';
  }) => void;
  /**
   * @description 点击行回调
   */
  onClickRow?: (
    e: MouseEvent,
    param: {
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 点击动作回调
   */
  onClickAction?: (
    e: MouseEvent,
    param: {
      action: TimelineAction;
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 点击动作回调（触发drag时不执行）
   */
  onClickActionOnly?: (
    e: MouseEvent,
    param: {
      action: TimelineAction;
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 双击行回调
   */
  onDoubleClickRow?: (
    e: MouseEvent,
    param: {
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 双击动作回调
   */
  onDoubleClickAction?: (
    e: MouseEvent,
    param: {
      action: TimelineAction;
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 右键行回调
   */
  onContextMenuRow?: (
    e: MouseEvent,
    param: {
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 右键动作回调
   */
  onContextMenuAction?: (
    e: MouseEvent,
    param: {
      action: TimelineAction;
      row: TimelineRow;
      time: number;
    }
  ) => void;
  /**
   * @description 获取要提示辅助线的action id列表，在move/resize start 时进行计算，默认获取除当前移动action的全部
   */
  getAssistDragLineActionIds?: (params: {
    action: TimelineAction;
    editorData: TimelineRow[];
    row: TimelineRow;
  }) => string[];
  /**
   * @description cursor开始拖拽事件
   */
  onCursorDragStart?: (time: number) => void;
  /**
   * @description cursor结束拖拽事件
   */
  onCursorDragEnd?: (time: number) => void;
  /**
   * @description cursor拖拽事件
   */
  onCursorDrag?: (time: number) => void;
  /**
   * @description 点击时间区域事件, 返回false时阻止设置时间
   */
  onClickTimeArea?: (time: number, e: MouseEvent) => boolean | undefined;
}

export interface TimelineState {
  /** dom节点 */
  target: HTMLElement;
  /** 运行监听器 */
  listener: Emitter<EventTypes>;
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 是否暂停中 */
  isPaused: boolean;
  /** 设置当前播放时间 */
  setTime: (time: number) => void;
  /** 获取当前播放时间 */
  getTime: () => number;
  /** 设置播放速率 */
  setPlayRate: (rate: number) => void;
  /** 设置播放速率 */
  getPlayRate: () => number;
  /** 重新渲染当前时间 */
  reRender: () => void;
  /** 播放 */
  play: (param: {
    /** 默认从头运行到尾, 优先级大于autoEnd */
    toTime?: number;
    /** 是否播放完后自动结束 */
    autoEnd?: boolean;
    /** 运行的actionId列表，不穿默认全部运行 */
    runActionIds?: string[];
  }) => boolean;
  /** 暂停 */
  pause: () => void;
  /** 设置scroll left */
  setScrollLeft: (val: number) => void;
  /** 设置scroll top */
  setScrollTop: (val: number) => void;
}

/**
 * 动画编辑器参数
 * @export
 * @interface TimelineProp
 */
export interface TimelineEditorProps extends EditData {
  /**
   * @description 编辑区域距离顶部滚动距离 (请使用ref.setScrollTop代替)
   * @deprecated
   */
  scrollTop?: number;
  /**
   * @description 编辑区域滚动回调 (用于控制与编辑行滚动同步)
   */
  onScroll?: (params: Event) => void;
  /**
   * @description 拖拽时是否启动自动滚动
   * @default false
   */
  autoScroll?: boolean;
  /**
   * @description 自定义timeline样式
   */
  style?: CSSProperties;
  /**
   * @description 是否自动重新渲染（当数据改变或光标时间改变时update tick）
   * @default true
   */
  autoReRender?: boolean;
  /**
   * @description 数据改变回调，会在操作动作end改变数据后触发(返回false会阻止自动engine同步，用于减少性能开销)
   */
  onChange?: (editorData: TimelineRow[]) => void | boolean;
}
