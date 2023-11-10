export const fpsRules = {
  24: [
    { gridValue: 2, cellCount: 2, unit: 'f' },
    { gridValue: 3, cellCount: 3, unit: 'f' },
    { gridValue: 6, cellCount: 6, unit: 'f' },
    { gridValue: 12, cellCount: 3, unit: 'f' }
  ],
  25: [{ gridValue: 5, cellCount: 5, unit: 'f' }],
  30: [
    { gridValue: 2, cellCount: 2, unit: 'f' },
    { gridValue: 3, cellCount: 3, unit: 'f' },
    { gridValue: 5, cellCount: 5, unit: 'f' },
    { gridValue: 10, cellCount: 10, unit: 'f' },
    { gridValue: 15, cellCount: 3, unit: 'f' }
  ],
  60: [
    { gridValue: 2, cellCount: 2, unit: 'f' },
    { gridValue: 3, cellCount: 3, unit: 'f' },
    { gridValue: 5, cellCount: 5, unit: 'f' },
    { gridValue: 10, cellCount: 10, unit: 'f' },
    { gridValue: 15, cellCount: 3, unit: 'f' },
    { gridValue: 30, cellCount: 10, unit: 'f' }
  ],
  120: [
    { gridValue: 2, cellCount: 2, unit: 'f' },
    { gridValue: 3, cellCount: 3, unit: 'f' },
    { gridValue: 5, cellCount: 5, unit: 'f' },
    { gridValue: 10, cellCount: 10, unit: 'f' },
    { gridValue: 15, cellCount: 3, unit: 'f' },
    { gridValue: 30, cellCount: 10, unit: 'f' },
    { gridValue: 60, cellCount: 10, unit: 'f' }
  ]
};
export const DURATION_BOUNDARY = 10 * 60 * 1000; // 轨道总时长的分解值，大于10min的和小于10min的，最小刻度（帧级）那里显示的不一样。
export const MAX_WIDTH_PER_BIG_GRID = 100; // 大格的最大宽度。
export const MIN_WIDTH_PER_BIG_GRID = 60; // 大格的最小宽度。
