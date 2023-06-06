declare namespace Player {
  interface Resolution {
    width: number;
    height: number;
  }
  /** 播放器配置 */
  interface Setting {
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
}
