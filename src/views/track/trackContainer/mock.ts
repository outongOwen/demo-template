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
        start: 0,
        end: 7 * 100100,
        type: 'video',
        effectId: 'video'
      },
      {
        id: '2',
        start: 8 * 101000,
        end: 10 * 101000,
        type: 'video',
        effectId: 'video'
      }
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
        start: 200,
        end: 1000 * 60 * 15,
        type: 'video',
        effectId: 'video'
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
  // {
  //   id: 'ggg',
  //   name: '轨道3',
  //   sideBarId: 'audio',
  //   type: 'audio',
  //   actions: []
  // },
  {
    id: 'h12hh',
    name: '轨道411',
    sideBarId: 'text',
    type: 'text',
    actions: [
      {
        id: '123213fff213',
        start: 1000 * 60,
        end: 1000 * 60 * 15,
        type: 'text',
        effectId: 'text'
      }
    ]
  },
  {
    id: 'hhh',
    name: '轨道4',
    sideBarId: 'text',
    type: 'text',
    actions: [
      {
        id: '123213213',
        start: 200,
        end: 1000 * 60 * 15,
        type: 'text',
        effectId: 'text'
      }
    ]
  }
  // {
  //   id: 'ffff12213213',
  //   name: '主轨道',
  //   sideBarId: 'main',
  //   type: 'main',
  //   rowHeight: 80,
  //   classNames: ['timeLine-main-row'],
  //   actions: []
  // }
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
