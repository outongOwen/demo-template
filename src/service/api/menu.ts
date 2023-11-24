import { defineHttp } from '@/service/request';

enum Api {
  GET_MENU_LIST = '/openapi/media-editor/menu/list'
}
export const getMenuList = () => {
  return defineHttp.get(
    {
      url: Api.GET_MENU_LIST
    },
    {
      ignoreCancelToken: false
    }
  );
};
