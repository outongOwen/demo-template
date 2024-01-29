import type { VNodeChild } from 'vue';
import type { AutoScrollOptions } from '@interactjs/auto-scroll/plugin';
import type { TimelineRow, TimelineEffect, TimelineSideBar } from '../../types';
import type { ITimelineEngine } from '../../core/engine';
import {
  BACKGROUND,
  SIDE_BAR_WIDTH,
  ROW_BACKGROUND,
  ROW_ACTIVE_BACKGROUND,
  MAIN_ROW_BACKGROUND,
  LEFT_OFFSET,
  ROW_HEIGHT,
  ROW_SPACING,
  SCALE_HEIGHT,
  SCALE_LARGE_CELL_WIDTH,
  SCALE_SMALL_CELL_WIDTH,
  SCALE_SMALL_CELL_MS,
  DEFAULT_GUIDE_LINE_SNAP,
  DEFAULT_FPS,
  DEFAULT_FPS_LIST
} from '../../const';
export const timeLineProps = {
  /**
   * @description 时间轴编辑数据
   * @default []
   * @required true
   * @type {TimelineRow[]}
   */
  editorData: {
    type: Array as PropType<TimelineRow[]>,
    default: (): TimelineRow[] => []
  },
  /**
   * @description 时间轴动作效果配置
   * @default null,
   * @type {Record<string, TimelineEffect>}
   */
  actionEffects: {
    type: Object as PropType<Record<string, TimelineEffect>>,
    default: null
  },
  /**
   * @description 时间轴侧边栏配置
   * @default null
   * @type {Record<string, TimelineSideBar>}
   */
  sideBars: {
    type: Object as PropType<Record<string, TimelineSideBar>>,
    default: null
  },
  /**
   * @description 时间轴帧率
   * @default 30
   * @type {number}
   */
  fps: {
    type: [String, Number] as PropType<string | number>,
    default: DEFAULT_FPS,
    validator(val) {
      return DEFAULT_FPS_LIST.includes(Number(val));
    }
  },
  /**
   * @description 是否开启侧边栏
   * @default false
   * @type {boolean}
   */
  showSideBar: {
    type: Boolean,
    default: false
  },
  /**
   * @description 是否开启主轴
   * @default false
   * @type {boolean}
   */
  mainRow: {
    type: Boolean,
    default: false
  },
  /**
   * @description 主轴行id
   * @default ''
   * @type {string}
   */
  mainRowId: {
    type: String,
    default: ''
  },
  /**
   * @description 时间轴行排序规则
   * @abstract 用于对行进行排序，不传则按照默认顺序排序
   * @abstract 重点提醒：如果传入该属性，那么所有行的type都必须在该数组中存在，否则会报错
   * @abstract 该属性会影响拖拽时的范围计算，如果不传则拖拽范围为全部行，如果传入该属性，则会严格按照类型行的范围进行拖拽（主轴除外）
   * @abstract 如果开启主轴，主轴可以全局拖拽，不受该属性影响
   * @default null
   * @type {string[]}
   * @example ['type1', 'type2', 'type3']
   */
  rowSortTypes: {
    type: Array as PropType<string[]>,
    default: null
  },
  /**
   * @description 时间轴背景色
   * @abstract 可以通过外部背景色继承也可以配置该属性进行背景色统一配置
   * @default rgba(40,40,40,1)
   * @type {string}
   */
  background: {
    type: String,
    default: BACKGROUND
  },
  /**
   * @description 每个编辑行默认高度（>0, 单位：px）
   * @default 50
   * @type {number}
   */
  rowHeight: {
    type: [String, Number] as PropType<string | number>,
    default: ROW_HEIGHT
  },
  /**
   * @description  编辑行默认行间距
   * @default 10
   * @type {number}
   */
  rowSpacing: {
    type: [String, Number] as PropType<string | number>,
    default: ROW_SPACING
  },
  /**
   * @description 时间轴背景色
   * @default rgba(50,50,50,1)
   * @type {string}
   */
  rowBackground: {
    type: String,
    default: ROW_BACKGROUND
  },
  /**
   * @description 时间轴激活背景色
   * @default rgba(70,70,70,1)
   * @type {string}
   */
  rowActiveBackground: {
    type: String,
    default: ROW_ACTIVE_BACKGROUND
  },
  /**
   * @description 时间轴主轴背景色
   * @default rgba(100,100,100,1)
   * @type {string}
   */
  mainRowBackground: {
    type: String,
    default: MAIN_ROW_BACKGROUND
  },
  /**
   * @description 时间轴容器左侧偏移距离
   * @default 0
   * @type {number}
   */
  leftOffset: {
    type: [String, Number] as PropType<string | number>,
    default: LEFT_OFFSET,
    validator: (val): boolean => Number(val) >= 0
  },
  /**
   * @description 侧边栏宽度
   * @default 150
   * @type {number}
   */
  sideBarWidth: {
    type: [String, Number] as PropType<string | number>,
    default: SIDE_BAR_WIDTH,
    validator: (val): boolean => Number(val) >= 0
  },

  /**
   * @description 刻度高度
   * @default 20
   * @type {number}
   */
  scaleHeight: {
    type: [String, Number] as PropType<string | number>,
    default: SCALE_HEIGHT,
    validator: (val): boolean => Number(val) > 0
  },
  /**
   * @description 小格宽度
   * @default 10
   * @type {number}
   */
  scaleSmallCellWidth: {
    type: [String, Number] as PropType<string | number>,
    default: SCALE_SMALL_CELL_WIDTH,
    validator: (val): boolean => Number(val) > 0
  },
  /**
   * @description 大格宽度
   * @default 100
   * @type {number}
   */
  scaleLargeCellWidth: {
    type: [String, Number] as PropType<string | number>,
    default: SCALE_LARGE_CELL_WIDTH,
    validator: (val): boolean => Number(val) > 0
  },
  /**
   * @description 小格刻度单位 （ms)
   * @default 1
   * @type {number}
   */
  scaleSmallCellMs: {
    type: [String, Number] as PropType<string | number>,
    default: SCALE_SMALL_CELL_MS,
    validator: (val): boolean => Number(val) > 0
  },
  /**
   * @description 是否开启鼠标吸附
   */
  cursorAdsorption: {
    type: Boolean,
    default: false
  },
  /**
   * @description 是否开启辅助线
   * @default false
   * @type {boolean}
   */
  guideLine: {
    type: Boolean,
    default: false
  },
  /**
   * @description 辅助线吸附距离
   */
  guideAdsorptionDistance: {
    type: [String, Number] as PropType<string | number>,
    default: DEFAULT_GUIDE_LINE_SNAP
  },
  /**
   * @description 开启主光标
   * @default false
   * @type {boolean}
   */
  hideCursor: {
    type: Boolean,
    default: false
  },
  /**
   * @description 开启预览光标
   */
  previewCursor: {
    type: Boolean,
    default: false
  },
  /**
   * @description 是否自动滚动
   * @abstract   #NOTE 此属性只在初始化时生效，无法动态修改(之后在文档中特殊标注)
   * @default false
   * @type {boolean}
   */
  autoScrollOptions: {
    type: Object as PropType<Partial<Omit<AutoScrollOptions, 'container'>>>,
    default: null
  },
  /**
   * @description 禁止全部动作区域拖动
   * @default false
   * @type {boolean}
   */
  disableDrag: {
    type: Boolean,
    default: false
  },
  /**
   * @description timeline运行器，不传则使用内置运行器
   * @default null
   * @type {ITimelineEngine}
   */
  engine: {
    type: Object as PropType<ITimelineEngine>,
    default: null
  },
  /**
   * @description 自定义action区域渲染
   * @default null
   * @type {Function}
   */
  getActionRender: {
    type: Function as PropType<(action: TimelineRow, row: TimelineRow) => VNodeChild | Component>,
    default: null
  },
  /**
   * @description   自定义scale渲染
   * @default null
   * @type {Function}
   */
  getScaleRender: {
    type: Function as PropType<(time: number, unit: 's' | 'f') => VNodeChild | Component>,
    default: null
  },
  /**
   * @description 自定义cursor渲染
   * @default null
   * @type {Function}
   */
  getCursorRender: {
    type: Function as PropType<() => VNodeChild | Component>,
    default: null
  }
} as const;
