import { uniqBy, sampleSize, range, random } from 'lodash-es';
import betterMock from 'better-mock';
import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_utils';
const apis: MockMethod[] = [
  {
    url: '/mock/media-editor/menu/list',
    method: 'get',
    response: (): Service.Result => {
      const data = betterMock.mock({
        'list|4': [
          {
            id: '@id',
            name: '@cname',
            extend: null,
            'type|1': ['Video', 'Image', 'Audio'],
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
      return resultSuccess(uniqBy(data.list, 'type'));
    }
  }
];

export default apis;
