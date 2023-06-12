import { faker } from '@faker-js/faker';
import betterMock from 'better-mock';
import type { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess } from '../_utils';
const demoList = (() => {
  const data = betterMock.mock({
    'list|150': [
      {
        id: '@guid',
        name: '@name',
        duration: '@integer( 10000, 2 * 60 * 60 * 1000 )',
        'sourcePath|1': [
          // 视频
          'https://dao-library.54traveler.com/videos/54traveler_final.mp4',
          'https://dao-library.54traveler.com/videos/ouzhou.mp4',
          'https://dao-library.54traveler.com/videos/yiselie.mp4',
          'https://dao-library.54traveler.com/videos/beijiang.mp4',
          'https://dao-library.54traveler.com/videos/beijiaer.mp4',
          'https://dao-library.54traveler.com/videos/gaojiasuo.mp4'
        ]
      }
    ]
  });
  data.list.forEach((item: any) => {
    item.preUrl = faker.image.urlLoremFlickr({
      width: faker.number.int({ min: 90, max: 192 }),
      height: faker.number.int({ min: 70, max: 108 }),
      category: 'nature'
    });
    item.path = faker.image.urlLoremFlickr({
      width: faker.number.int({ min: 3840, max: 3840 }),
      height: faker.number.int({ min: 2160, max: 2160 }),
      category: 'nature'
    });
  });
  return data.list;
})();
const audioDemoList = (() => {
  const data = betterMock.mock({
    'list|150': [
      {
        id: '@guid',
        name: '@name',
        duration: '@integer( 10000, 2 * 60 * 60 * 1000 )',
        'sourcePath|1': [
          // 视频
          'http://36.155.98.104:12480/vrnas/audio/source/local/bigFile/bd9ab3abdc9/3906568f914edbf479cac/user/10024776/1661928013639622656.MP3',
          'http://36.155.98.104:12480/vrnas/audio/source/local/bigFile/bd9ab3abdc9/3906568f914edbf479cac/user/10024776/1661928015275401216.MP3',
          'http://36.155.98.104:12480/vrnas/audio/source/local/bigFile/bd9ab3abdc9/3906568f914edbf479cac/user/10024776/1661916977410777088.MP3'
        ]
      }
    ]
  });
  data.list.forEach((item: any) => {
    item.preUrl = faker.image.urlLoremFlickr({
      width: faker.number.int({ min: 90, max: 192 }),
      height: faker.number.int({ min: 70, max: 108 }),
      category: 'model'
    });
    item.path = faker.image.urlLoremFlickr({
      width: faker.number.int({ min: 1920, max: 2160 }),
      height: faker.number.int({ min: 1080, max: 1440 }),
      category: 'model'
    });
  });
  return data.list;
})();
export default [
  {
    url: '/mock/media-editor/catalogMedium/list',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, demoList);
    }
  },
  {
    url: '/mock/media-editor/catalogAudioMedium/list',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, audioDemoList);
    }
  }
] as MockMethod[];
