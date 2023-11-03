import { defineHttp } from '@/service/request';

enum Api {
  GET_CATALOG_MEDIUM_LIST = '/openapi/media-editor/catalogMedium/list',
  GET_FIRST_ORG_INFO = '/api/user-permission/getFirstOrgInfo',
  GET_SECOND_ORG_INFO = '/api/user-permission/getSecondOrgInfo',
  GET_USER_BIND_LIST = '/api/user-permission/getUserBindList'
}
export const getCatalogMediumList = (params: any) => {
  return defineHttp.get<Record<string, any>>(
    {
      url: Api.GET_CATALOG_MEDIUM_LIST,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};
// 获取一级组织信息
export const getFirstOrgInfo = (params?: any) => {
  return defineHttp.get<Record<string, any>>(
    {
      url: Api.GET_FIRST_ORG_INFO,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};
// 获取二级组织信息
export const getSecondOrgInfo = (params: any) => {
  return defineHttp.get<Record<string, any>>(
    {
      url: Api.GET_SECOND_ORG_INFO,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};
// 获取用户信息
export const getUserBindList = (params?: any) => {
  return defineHttp.get<Record<string, any>>(
    {
      url: Api.GET_USER_BIND_LIST,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};
