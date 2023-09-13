import { faker } from '@faker-js/faker';
import { mock as betterMock } from 'better-mock';
import { defineMock } from 'vite-plugin-mock-dev-server';
import { resultPageSuccess } from './utils';
const demoList = (() => {
  const data = betterMock({
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
      width: faker.number.int({ min: 1920, max: 2160 }),
      height: faker.number.int({ min: 1080, max: 1440 }),
      category: 'model'
    });
    item.preUrl = url; // 视频封面
    item.path = url; // 源文件
  });
  return data.list;
})();
const audioDemoList = (() => {
  const data = betterMock({
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
      width: faker.number.int({ min: 900, max: 1920 }),
      height: faker.number.int({ min: 700, max: 1080 }),
      category: 'nature'
    });
    item.path = faker.image.urlLoremFlickr({
      width: faker.number.int({ min: 1920, max: 2160 }),
      height: faker.number.int({ min: 1080, max: 1440 }),
      category: 'nature'
    });
  });
  return data.list;
})();
export default defineMock([
  {
    url: '/mock/media-editor/catalogMedium/list',
    delay: 1000,
    method: 'GET',
    response: (req, res) => {
      const { page = 1, pageSize = 20 } = req.query;
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(resultPageSuccess(page, pageSize, demoList)));
    }
  },
  {
    url: '/mock/media-editor/catalogAudioMedium/list',
    delay: 1000,
    method: 'GET',
    response: ({ query }, res) => {
      const { page = 1, pageSize = 20 } = query;
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(resultPageSuccess(page, pageSize, audioDemoList)));
    }
  }
]);
