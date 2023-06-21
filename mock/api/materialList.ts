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
    const url = faker.image.urlLoremFlickr({
      width: faker.number.int({ min: 192, max: 216 }),
      height: faker.number.int({ min: 108, max: 144 }),
      category: 'nature'
    });
    item.preUrl = url; // 视频封面
    item.path = url; // 源文件
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
          'https://raw.githubusercontent.com/outongOwen/picture_bed/main/image/202306190000628.mp3',
          'https://raw.githubusercontent.com/outongOwen/picture_bed/main/image/202306190001205.mp3',
          'https://raw.githubusercontent.com/outongOwen/picture_bed/main/image/202306190002439.mp3'
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
      width: faker.number.int({ min: 192, max: 216 }),
      height: faker.number.int({ min: 108, max: 144 }),
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
