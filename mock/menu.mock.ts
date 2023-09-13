import { defineMock } from 'vite-plugin-mock-dev-server';
import { uniqBy, sampleSize, range, random } from 'lodash';
import { mock as betterMock } from 'better-mock';
import { resultSuccess } from './utils';
const menuData = betterMock({
  'list|4': [
    {
      id: '@id',
      name: '@cname',
      extend: null,
      'type|1': ['Video', 'Image', 'Audio', 'Transparent'],
      children: sampleSize(range(1, 11), random(1, 11)).map(() => {
        return {
          id: '@id',
          name: '@cname',
          extend: null,
          type: '@word'
        };
      })
    }
  ]
});
export default defineMock({
  url: '/mock/media-editor/menu/list',
  method: 'GET',
  body: JSON.stringify(resultSuccess(uniqBy(menuData.list, 'id')))
});
