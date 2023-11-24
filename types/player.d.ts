interface Visibility {
  /** 左中 */
  ml: boolean;
  /** 右中 */
  mr: boolean;
  /** 下中 */
  mb: boolean;
  /** 上中 */
  mt: boolean;
  /** 左上 */
  tl: boolean;
  /** 右上 */
  tr: boolean;
  /** 左下 */
  bl: boolean;
  /** 右下 */
  br: boolean;
  /** 旋转 */
  mtr: boolean;
}
/** 对齐线标志设置 */
interface LineSignOptions {
  /** 线宽 */
  lineWidth: number;
  /** 大小 */
  size: number;
  /** 颜色 */
  color: string;
}

declare namespace Player {
  /** 分辨率 */
  interface Resolution {
    width: number;
    height: number;
  }
  /** 播放器配置 */
  interface BaseSetting {
    /** 帧率 */
    frameRate: number;
    /** 音量 */
    volume: number;
    /** 倍速 */
    speed: number;
    /** 分辨率参照基数 */
    resolutionReferenceBase: number;
    /** 默认分辨率 */
    defaultResolution: Resolution;
    /** 比例 */
    proportion: string;
    /** 最大分辨率 */
    maxResolution: number;
    /** 最小分辨率 */
    minResolution: number;
    /** 最短边最大分辨率 */
    shortestEdgeMaxResolution: number;
    /** 最短边最小分辨率 */
    shortestEdgeMinResolution: number;
  }
  /** 画布设置 */
  /** 控制器设置 */
  interface CanvasControlsSetting {
    /** 边框颜色 */
    borderColor: string;
    /** 句柄颜色 */
    cornerColor: string;
    /** 句柄边框颜色 */
    cornerStrokeColor: string;
    /** 是否透明句柄 */
    transparentCorners: boolean;
    /** 触摸句柄大小 */
    touchCornerSize: number;
    /** 句柄大小 */
    cornerSize: number;
    /** 句柄样式 */
    cornerStyle: string;
    /** 句柄虚线 */
    cornerDashArray?: any;
    /** 边框缩放因子 */
    borderScaleFactor: number;
    /** 内边距 */
    padding: number;
    /** 是否有控制器 */
    hasControls: boolean;
    /** 可见性 */
    visibility: Visibility;
  }
  /** 对齐线设置 */
  interface CanvasAlignGuidelinesSetting {
    /** 自动吸附 */
    autoAdsorb: boolean;
    /** 对齐线边距(吸附安全距离) */
    aligningLineMargin: number;
    /** 对齐线宽度 */
    aligningLineWidth: number;
    /** 对齐线颜色 */
    aligningLineColor: string;
    /** 是否开启对齐线标志 */
    isOpenLineSign: boolean;
    /** 是否开启对齐线 */
    isOpenAlignGuidelines: boolean;
    /** 对齐线预设 */
    alignGuidelinesPreset: Array<'canvas' | 'object' | 'objectRotation'>;
    /** 对齐线标志设置 */
    lineSignOptions: LineSignOptions;
    /** 忽略对象类型 */
    ignoreObjTypes: any[];
    /** 选取对象类型 */
    pickObjTypes: any[];
  }
}
