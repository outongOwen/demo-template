import type { TimelineRow, TimelineEffect, TimelineSideBar } from '@/plugins/timeLine';
import TimeLineSideBar from './timeLineSideBar/index.vue';
export const mockData: TimelineRow[] = [
  {
    id: '213213',
    name: '轨道1',
    sideBarId: 'video',
    rowHeight: 50,
    type: 'video',
    actions: [
      {
        id: '1',
        start: 2000,
        end: 7 * 1000,
        trimStart: 0,
        trimEnd: 5 * 1000,
        type: 'video',
        effectId: 'video',
        duration: 7 * 1000
      }
      // {
      //   id: '2',
      //   start: 200,
      //   end: 300,
      //   effectId: 'video',
      //   type: 'video'
      // },
      // {
      //   id: '3',
      //   start: 400,
      //   end: 500,
      //   effectId: 'video',
      //   type: 'video'
      // }
    ]
  },
  {
    id: 'fff',
    name: '轨道2',
    type: 'video',
    sideBarId: 'video',
    rowHeight: 70,
    actions: [
      {
        id: '12222',
        start: 0,
        end: 1000 * 60 * 15,
        trimStart: 0,
        trimEnd: 1000 * 60 * 15,
        type: 'video',
        effectId: 'video',
        duration: 1000 * 60 * 15
      }
    ]
  },
  // {
  //   id: 'fffddd',
  //   name: '轨道2',
  //   type: 'video',
  //   sideBarId: 'video',
  //   actions: []
  // },
  {
    id: 'ggg',
    name: '轨道3',
    sideBarId: 'audio',
    type: 'audio',
    actions: []
  },
  {
    id: 'hhh',
    name: '轨道4',
    sideBarId: 'text',
    type: 'text',
    actions: []
  },
  {
    id: 'ffff12213213',
    name: '主轨道',
    sideBarId: 'main',
    type: 'main',
    rowHeight: 80,
    classNames: ['timeLine-main-row'],
    actions: []
  }
  // {
  //   id: 'DDD',
  //   name: '轨道5',
  //   sideBarId: 'video',
  //   type: 'video',
  //   actions: []
  // },
  // {
  //   id: 'EEE',
  //   name: '轨道6',
  //   sideBarId: 'audio',
  //   type: 'audio',
  //   actions: []
  // },
  // {
  //   id: '112223',
  //   name: '轨道6.5',
  //   sideBarId: 'audio',
  //   type: 'audio',
  //   actions: []
  // },
  // {
  //   id: 'FFF',
  //   name: '轨道7',
  //   sideBarId: 'text',
  //   type: 'text',
  //   rowHeight: 30,
  //   actions: []
  // },
  // {
  //   id: 'GGG',
  //   name: '轨道8',
  //   sideBarId: 'audio',
  //   type: 'audio',
  //   actions: []
  // }
];

export const effects: Record<string, TimelineEffect> = {};
export const sideBars: Record<string, TimelineSideBar> = {
  main: {
    id: 'main',
    render: () => {
      return h(TimeLineSideBar);
    }
  },
  video: {
    id: 'video',
    render: () => {
      return h(TimeLineSideBar);
    }
  },
  audio: {
    id: 'audio',
    render: () => {
      return h(TimeLineSideBar);
    }
  },
  text: {
    id: 'text',
    render: () => {
      return h(TimeLineSideBar);
    }
  }
};
