import type { SCALE_GRID_SEGMENT_ITEM } from '../types';
import { DEFAULT_FPS_LIST } from './system';
const getGridSegmentList = fps => {
  return [
    {
      maxWidth: 10,
      minWidth: 5,
      gridFrame: fps / 10,
      groupGridFrame: fps // 1s
    },
    {
      maxWidth: 5,
      minWidth: 30 / 9,
      gridFrame: (2 * fps) / 10,
      groupGridFrame: 2 * fps
    },
    // level8
    {
      maxWidth: 30 / 9,
      minWidth: 2,
      gridFrame: (3 * fps) / 10,
      groupGridFrame: 3 * fps // 3s
    },
    // level9
    {
      maxWidth: 2,
      minWidth: 1,
      gridFrame: (5 * fps) / 10,
      groupGridFrame: 5 * fps // 5s
    },
    // level10
    {
      maxWidth: 1,
      minWidth: 30 / 90,
      gridFrame: (10 * fps) / 10,
      groupGridFrame: 10 * fps // 10s
    },
    // level11
    {
      maxWidth: 30 / 90,
      minWidth: 30 / 180,
      gridFrame: (30 * fps) / 10,
      groupGridFrame: 30 * fps // 30s
    },
    // level12
    {
      maxWidth: 30 / 180,
      minWidth: 30 / 360,
      gridFrame: (1 * 60 * fps) / 10,
      groupGridFrame: 1 * 60 * fps // 1min
    },
    // level13
    {
      maxWidth: 30 / 360,
      minWidth: 30 / 540,
      gridFrame: (2 * 60 * fps) / 10,
      groupGridFrame: 2 * 60 * fps // 120s-2min
    },
    // level14
    {
      maxWidth: 30 / 540,
      minWidth: 30 / 900,
      gridFrame: (3 * 60 * fps) / 10,
      groupGridFrame: 3 * 60 * fps // 180s---3min
    },
    // level15
    {
      maxWidth: 30 / 900,
      minWidth: 30 / 1800,
      gridFrame: (5 * 60 * fps) / 10,
      groupGridFrame: 5 * 60 * fps // 300s--5min
    },
    // level16
    {
      maxWidth: 30 / 1800,
      minWidth: 30 / 5400,
      gridFrame: (10 * 60 * fps) / 10,
      groupGridFrame: 10 * 60 * fps // 600s- 10min
    },
    // level17
    {
      maxWidth: 30 / 5400,
      minWidth: 30 / 21600,
      gridFrame: (10 * 60 * fps) / 10,
      groupGridFrame: 30 * 60 * fps // 1800s---30min
    },
    // level18
    {
      maxWidth: 30 / 21600,
      minWidth: 30 / 32400,
      gridFrame: (120 * 60 * fps) / 10,
      groupGridFrame: 120 * 60 * fps // 7200s - 120min
    },
    // level19
    {
      maxWidth: 30 / 32400,
      minWidth: 30 / 54000,
      gridFrame: (180 * 60 * fps) / 10,
      groupGridFrame: 180 * 60 * fps // 180min
    },
    // level20
    {
      maxWidth: 30 / 54000,
      minWidth: 30 / 108000,
      gridFrame: (300 * 60 * fps) / 10,
      groupGridFrame: 300 * 60 * fps // 300min
    },
    // level21
    {
      maxWidth: 30 / 108000,
      minWidth: 30 / 324000,
      gridFrame: (600 * 60 * fps) / 10,
      groupGridFrame: 600 * 60 * fps // 600min
    },
    // level22
    {
      maxWidth: 30 / 324000,
      minWidth: 30 / 32400000000000000000,
      gridFrame: (1800 * 60 * fps) / 10,
      groupGridFrame: 1800 * 60 * fps // 1800min
    }
  ];
};
const SCALE_GRID_SEGMENT_24 = [
  // level1
  {
    maxWidth: 200,
    minWidth: 80,
    gridFrame: 1,
    groupGridFrame: 2
  },
  // level2
  {
    maxWidth: 80,
    minWidth: 43,
    gridFrame: 1,
    groupGridFrame: 3
  },
  // level2
  {
    maxWidth: 43,
    minWidth: 33,
    gridFrame: 1,
    groupGridFrame: 4
  },
  // level2
  {
    maxWidth: 33,
    minWidth: 27,
    gridFrame: 2,
    groupGridFrame: 8
  },
  // level2
  {
    maxWidth: 27,
    minWidth: 10,
    gridFrame: 3,
    groupGridFrame: 12
  }
];
const SCALE_GRID_SEGMENT_25 = [
  {
    maxWidth: 200,
    minWidth: 10,
    gridFrame: 1,
    groupGridFrame: 5 // 5 frame
  }
];
const SCALE_GRID_SEGMENT_30 = [
  // level1
  {
    maxWidth: 200,
    minWidth: 43,
    gridFrame: 1,
    groupGridFrame: 2
  },
  // level2
  {
    maxWidth: 43,
    minWidth: 33,
    gridFrame: 1,
    groupGridFrame: 3
  },
  // level3
  {
    maxWidth: 33,
    minWidth: 27,
    gridFrame: 1,
    groupGridFrame: 5
  },
  // level4
  {
    maxWidth: 27,
    minWidth: 20,
    gridFrame: 1,
    groupGridFrame: 10
  },
  // level5
  {
    maxWidth: 20,
    minWidth: 10,
    gridFrame: 3,
    groupGridFrame: 15
  }
];
const SCALE_GRID_SEGMENT_50 = [
  // level1
  {
    maxWidth: 200,
    minWidth: 100,
    gridFrame: 1,
    groupGridFrame: 2
  },
  // level2
  {
    maxWidth: 100,
    minWidth: 25,
    gridFrame: 1,
    groupGridFrame: 5
  },
  // level3
  {
    maxWidth: 25,
    minWidth: 13,
    gridFrame: 2,
    groupGridFrame: 10
  },
  // level4
  {
    maxWidth: 13,
    minWidth: 10,
    gridFrame: 5,
    groupGridFrame: 25
  }
];
const SCALE_GRID_SEGMENT_60 = [];
export const GET_SCALE_GRID_SEGMENT: Map<number, Array<SCALE_GRID_SEGMENT_ITEM>> = (() => {
  const scaleGridSegment = new Map<number, Array<SCALE_GRID_SEGMENT_ITEM>>();
  DEFAULT_FPS_LIST.forEach(fps => {
    fps === 24 && scaleGridSegment.set(fps, [...SCALE_GRID_SEGMENT_24, ...getGridSegmentList(fps)]);
    fps === 25 && scaleGridSegment.set(fps, [...SCALE_GRID_SEGMENT_25, ...getGridSegmentList(fps)]);
    fps === 30 && scaleGridSegment.set(fps, [...SCALE_GRID_SEGMENT_30, ...getGridSegmentList(fps)]);
    fps === 50 && scaleGridSegment.set(fps, [...SCALE_GRID_SEGMENT_50, ...getGridSegmentList(fps)]);
    fps === 60 && scaleGridSegment.set(fps, [...SCALE_GRID_SEGMENT_60, ...getGridSegmentList(fps)]);
  });
  return scaleGridSegment as Map<number, Array<SCALE_GRID_SEGMENT_ITEM>>;
})();
