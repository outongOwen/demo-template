import type { SCALE_GRID_SEGMENT_ITEM } from '../types';
import { DEFAULT_FPS_LIST } from './system';
const SCALE_GRID_SEGMENT_24 = [
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
  },
  // level6
  {
    maxWidth: 10,
    minWidth: 5,
    gridFrame: 3,
    groupGridFrame: 30
  },
  // level7
  {
    maxWidth: 5,
    minWidth: 30 / 9,
    gridFrame: 6,
    groupGridFrame: 60
  },
  // level8
  {
    maxWidth: 30 / 9,
    minWidth: 2,
    gridFrame: 9,
    groupGridFrame: 90
  },
  // level9
  {
    maxWidth: 2,
    minWidth: 1,
    gridFrame: 15,
    groupGridFrame: 150
  },
  // level10
  {
    maxWidth: 1,
    minWidth: 30 / 90,
    gridFrame: 30,
    groupGridFrame: 300
  },
  // level11
  {
    maxWidth: 30 / 90,
    minWidth: 30 / 180,
    gridFrame: 90,
    groupGridFrame: 900
  },
  // level12
  {
    maxWidth: 30 / 180,
    minWidth: 30 / 360,
    gridFrame: 180,
    groupGridFrame: 1800
  },
  // level13
  {
    maxWidth: 30 / 360,
    minWidth: 30 / 540,
    gridFrame: 360,
    groupGridFrame: 3600
  },
  // level14
  {
    maxWidth: 30 / 540,
    minWidth: 30 / 900,
    gridFrame: 540,
    groupGridFrame: 5400
  },
  // level15
  {
    maxWidth: 30 / 900,
    minWidth: 30 / 1800,
    gridFrame: 900,
    groupGridFrame: 9000
  },
  // level16
  {
    maxWidth: 30 / 1800,
    minWidth: 30 / 5400,
    gridFrame: 1800,
    groupGridFrame: 18000
  },
  // level17
  {
    maxWidth: 30 / 5400,
    minWidth: 30 / 21600,
    gridFrame: 5400,
    groupGridFrame: 54000
  },
  // level18
  {
    maxWidth: 30 / 21600,
    minWidth: 30 / 32400,
    gridFrame: 21600,
    groupGridFrame: 216000
  },
  // level19
  {
    maxWidth: 30 / 32400,
    minWidth: 30 / 54000,
    gridFrame: 32400,
    groupGridFrame: 324000
  },
  // level20
  {
    maxWidth: 30 / 54000,
    minWidth: 30 / 108000,
    gridFrame: 54000,
    groupGridFrame: 540000
  },
  // level21
  {
    maxWidth: 30 / 108000,
    minWidth: 30 / 324000,
    gridFrame: 108000,
    groupGridFrame: 1080000
  },
  // level22
  {
    maxWidth: 30 / 324000,
    minWidth: 30 / 32400000000000000000,
    gridFrame: 324000,
    groupGridFrame: 3240000
  }
];
const SCALE_GRID_SEGMENT_25 = [
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
  },
  // level6
  {
    maxWidth: 10,
    minWidth: 5,
    gridFrame: 3,
    groupGridFrame: 30
  },
  // level7
  {
    maxWidth: 5,
    minWidth: 30 / 9,
    gridFrame: 6,
    groupGridFrame: 60
  },
  // level8
  {
    maxWidth: 30 / 9,
    minWidth: 2,
    gridFrame: 9,
    groupGridFrame: 90
  },
  // level9
  {
    maxWidth: 2,
    minWidth: 1,
    gridFrame: 15,
    groupGridFrame: 150
  },
  // level10
  {
    maxWidth: 1,
    minWidth: 30 / 90,
    gridFrame: 30,
    groupGridFrame: 300
  },
  // level11
  {
    maxWidth: 30 / 90,
    minWidth: 30 / 180,
    gridFrame: 90,
    groupGridFrame: 900
  },
  // level12
  {
    maxWidth: 30 / 180,
    minWidth: 30 / 360,
    gridFrame: 180,
    groupGridFrame: 1800
  },
  // level13
  {
    maxWidth: 30 / 360,
    minWidth: 30 / 540,
    gridFrame: 360,
    groupGridFrame: 3600
  },
  // level14
  {
    maxWidth: 30 / 540,
    minWidth: 30 / 900,
    gridFrame: 540,
    groupGridFrame: 5400
  },
  // level15
  {
    maxWidth: 30 / 900,
    minWidth: 30 / 1800,
    gridFrame: 900,
    groupGridFrame: 9000
  },
  // level16
  {
    maxWidth: 30 / 1800,
    minWidth: 30 / 5400,
    gridFrame: 1800,
    groupGridFrame: 18000
  },
  // level17
  {
    maxWidth: 30 / 5400,
    minWidth: 30 / 21600,
    gridFrame: 5400,
    groupGridFrame: 54000
  },
  // level18
  {
    maxWidth: 30 / 21600,
    minWidth: 30 / 32400,
    gridFrame: 21600,
    groupGridFrame: 216000
  },
  // level19
  {
    maxWidth: 30 / 32400,
    minWidth: 30 / 54000,
    gridFrame: 32400,
    groupGridFrame: 324000
  },
  // level20
  {
    maxWidth: 30 / 54000,
    minWidth: 30 / 108000,
    gridFrame: 54000,
    groupGridFrame: 540000
  },
  // level21
  {
    maxWidth: 30 / 108000,
    minWidth: 30 / 324000,
    gridFrame: 108000,
    groupGridFrame: 1080000
  },
  // level22
  {
    maxWidth: 30 / 324000,
    minWidth: 30 / 32400000000000000000,
    gridFrame: 324000,
    groupGridFrame: 3240000
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
  },
  // level6
  {
    maxWidth: 10,
    minWidth: 5,
    gridFrame: 3,
    groupGridFrame: 30
  },
  // level7
  {
    maxWidth: 5,
    minWidth: 30 / 9,
    gridFrame: 6,
    groupGridFrame: 60
  },
  // level8
  {
    maxWidth: 30 / 9,
    minWidth: 2,
    gridFrame: 9,
    groupGridFrame: 90
  },
  // level9
  {
    maxWidth: 2,
    minWidth: 1,
    gridFrame: 15,
    groupGridFrame: 150
  },
  // level10
  {
    maxWidth: 1,
    minWidth: 30 / 90,
    gridFrame: 30,
    groupGridFrame: 300
  },
  // level11
  {
    maxWidth: 30 / 90,
    minWidth: 30 / 180,
    gridFrame: 90,
    groupGridFrame: 900
  },
  // level12
  {
    maxWidth: 30 / 180,
    minWidth: 30 / 360,
    gridFrame: 180,
    groupGridFrame: 1800
  },
  // level13
  {
    maxWidth: 30 / 360,
    minWidth: 30 / 540,
    gridFrame: 360,
    groupGridFrame: 3600
  },
  // level14
  {
    maxWidth: 30 / 540,
    minWidth: 30 / 900,
    gridFrame: 540,
    groupGridFrame: 5400
  },
  // level15
  {
    maxWidth: 30 / 900,
    minWidth: 30 / 1800,
    gridFrame: 900,
    groupGridFrame: 9000
  },
  // level16
  {
    maxWidth: 30 / 1800,
    minWidth: 30 / 5400,
    gridFrame: 1800,
    groupGridFrame: 18000
  },
  // level17
  {
    maxWidth: 30 / 5400,
    minWidth: 30 / 21600,
    gridFrame: 5400,
    groupGridFrame: 54000
  },
  // level18
  {
    maxWidth: 30 / 21600,
    minWidth: 30 / 32400,
    gridFrame: 21600,
    groupGridFrame: 216000
  },
  // level19
  {
    maxWidth: 30 / 32400,
    minWidth: 30 / 54000,
    gridFrame: 32400,
    groupGridFrame: 324000
  },
  // level20
  {
    maxWidth: 30 / 54000,
    minWidth: 30 / 108000,
    gridFrame: 54000,
    groupGridFrame: 540000
  },
  // level21
  {
    maxWidth: 30 / 108000,
    minWidth: 30 / 324000,
    gridFrame: 108000,
    groupGridFrame: 1080000
  },
  // level22
  {
    maxWidth: 30 / 324000,
    minWidth: 30 / 32400000000000000000,
    gridFrame: 324000,
    groupGridFrame: 3240000
  }
];
const SCALE_GRID_SEGMENT_50 = [
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
  },
  // level6
  {
    maxWidth: 10,
    minWidth: 5,
    gridFrame: 3,
    groupGridFrame: 30
  },
  // level7
  {
    maxWidth: 5,
    minWidth: 30 / 9,
    gridFrame: 6,
    groupGridFrame: 60
  },
  // level8
  {
    maxWidth: 30 / 9,
    minWidth: 2,
    gridFrame: 9,
    groupGridFrame: 90
  },
  // level9
  {
    maxWidth: 2,
    minWidth: 1,
    gridFrame: 15,
    groupGridFrame: 150
  },
  // level10
  {
    maxWidth: 1,
    minWidth: 30 / 90,
    gridFrame: 30,
    groupGridFrame: 300
  },
  // level11
  {
    maxWidth: 30 / 90,
    minWidth: 30 / 180,
    gridFrame: 90,
    groupGridFrame: 900
  },
  // level12
  {
    maxWidth: 30 / 180,
    minWidth: 30 / 360,
    gridFrame: 180,
    groupGridFrame: 1800
  },
  // level13
  {
    maxWidth: 30 / 360,
    minWidth: 30 / 540,
    gridFrame: 360,
    groupGridFrame: 3600
  },
  // level14
  {
    maxWidth: 30 / 540,
    minWidth: 30 / 900,
    gridFrame: 540,
    groupGridFrame: 5400
  },
  // level15
  {
    maxWidth: 30 / 900,
    minWidth: 30 / 1800,
    gridFrame: 900,
    groupGridFrame: 9000
  },
  // level16
  {
    maxWidth: 30 / 1800,
    minWidth: 30 / 5400,
    gridFrame: 1800,
    groupGridFrame: 18000
  },
  // level17
  {
    maxWidth: 30 / 5400,
    minWidth: 30 / 21600,
    gridFrame: 5400,
    groupGridFrame: 54000
  },
  // level18
  {
    maxWidth: 30 / 21600,
    minWidth: 30 / 32400,
    gridFrame: 21600,
    groupGridFrame: 216000
  },
  // level19
  {
    maxWidth: 30 / 32400,
    minWidth: 30 / 54000,
    gridFrame: 32400,
    groupGridFrame: 324000
  },
  // level20
  {
    maxWidth: 30 / 54000,
    minWidth: 30 / 108000,
    gridFrame: 54000,
    groupGridFrame: 540000
  },
  // level21
  {
    maxWidth: 30 / 108000,
    minWidth: 30 / 324000,
    gridFrame: 108000,
    groupGridFrame: 1080000
  },
  // level22
  {
    maxWidth: 30 / 324000,
    minWidth: 30 / 32400000000000000000,
    gridFrame: 324000,
    groupGridFrame: 3240000
  }
];
const SCALE_GRID_SEGMENT_60 = [
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
  },
  // level6
  {
    maxWidth: 10,
    minWidth: 5,
    gridFrame: 3,
    groupGridFrame: 30
  },
  // level7
  {
    maxWidth: 5,
    minWidth: 30 / 9,
    gridFrame: 6,
    groupGridFrame: 60
  },
  // level8
  {
    maxWidth: 30 / 9,
    minWidth: 2,
    gridFrame: 9,
    groupGridFrame: 90
  },
  // level9
  {
    maxWidth: 2,
    minWidth: 1,
    gridFrame: 15,
    groupGridFrame: 150
  },
  // level10
  {
    maxWidth: 1,
    minWidth: 30 / 90,
    gridFrame: 30,
    groupGridFrame: 300
  },
  // level11
  {
    maxWidth: 30 / 90,
    minWidth: 30 / 180,
    gridFrame: 90,
    groupGridFrame: 900
  },
  // level12
  {
    maxWidth: 30 / 180,
    minWidth: 30 / 360,
    gridFrame: 180,
    groupGridFrame: 1800
  },
  // level13
  {
    maxWidth: 30 / 360,
    minWidth: 30 / 540,
    gridFrame: 360,
    groupGridFrame: 3600
  },
  // level14
  {
    maxWidth: 30 / 540,
    minWidth: 30 / 900,
    gridFrame: 540,
    groupGridFrame: 5400
  },
  // level15
  {
    maxWidth: 30 / 900,
    minWidth: 30 / 1800,
    gridFrame: 900,
    groupGridFrame: 9000
  },
  // level16
  {
    maxWidth: 30 / 1800,
    minWidth: 30 / 5400,
    gridFrame: 1800,
    groupGridFrame: 18000
  },
  // level17
  {
    maxWidth: 30 / 5400,
    minWidth: 30 / 21600,
    gridFrame: 5400,
    groupGridFrame: 54000
  },
  // level18
  {
    maxWidth: 30 / 21600,
    minWidth: 30 / 32400,
    gridFrame: 21600,
    groupGridFrame: 216000
  },
  // level19
  {
    maxWidth: 30 / 32400,
    minWidth: 30 / 54000,
    gridFrame: 32400,
    groupGridFrame: 324000
  },
  // level20
  {
    maxWidth: 30 / 54000,
    minWidth: 30 / 108000,
    gridFrame: 54000,
    groupGridFrame: 540000
  },
  // level21
  {
    maxWidth: 30 / 108000,
    minWidth: 30 / 324000,
    gridFrame: 108000,
    groupGridFrame: 1080000
  },
  // level22
  {
    maxWidth: 30 / 324000,
    minWidth: 30 / 32400000000000000000,
    gridFrame: 324000,
    groupGridFrame: 3240000
  }
];
export const GET_SCALE_GRID_SEGMENT: Map<number, Array<SCALE_GRID_SEGMENT_ITEM>> = (() => {
  const scaleGridSegment = new Map<number, Array<SCALE_GRID_SEGMENT_ITEM>>();
  DEFAULT_FPS_LIST.forEach(fps => {
    fps === 24 && scaleGridSegment.set(fps, SCALE_GRID_SEGMENT_24);
    fps === 25 && scaleGridSegment.set(fps, SCALE_GRID_SEGMENT_25);
    fps === 30 && scaleGridSegment.set(fps, SCALE_GRID_SEGMENT_30);
    fps === 50 && scaleGridSegment.set(fps, SCALE_GRID_SEGMENT_50);
    fps === 60 && scaleGridSegment.set(fps, SCALE_GRID_SEGMENT_60);
  });
  return scaleGridSegment as Map<number, Array<SCALE_GRID_SEGMENT_ITEM>>;
})();
