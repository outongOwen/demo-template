import { mockRequest } from '@/service/request';

enum Api {
  GET_MENU_LIST = '/mock/media-editor/menu/list',
  GET_CATALOG_MEDIUM_LIST = '/media-editor/catalogMedium/list',
  GET_CATALOG_AUDIO_MEDIUM_LIST = '/media-editor/catalogAudioMedium/list'
}
// export const getMenuList = () => {
//   return defineHttp.get(
//     {
//       url: Api.GET_MENU_LIST
//     },
//     {
//       ignoreCancelToken: false
//     }
//   );
// };
// export const getCatalogMediumList = (params: any) => {
//   return mockRequest.get<Record<string, any>>(
//     {
//       url: Api.GET_CATALOG_MEDIUM_LIST,
//       params
//     },
//     {
//       ignoreCancelToken: false
//     }
//   );
// };
export const getCatalogAudioMediumList = (params: any) => {
  return mockRequest.get<Record<string, any>>(
    {
      url: Api.GET_CATALOG_AUDIO_MEDIUM_LIST,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};
