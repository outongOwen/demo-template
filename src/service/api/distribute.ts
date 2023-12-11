import { getQueryString } from '@/utils';
import { defineHttp } from '@/service/request';
const accessToken = getQueryString('accessToken');

enum Api {
  GET_CATALOG_ENUM = '/openapi/media-editor/catalog/data',
  GET_ES_INFO = '/openapi/media-editor/esSearch',
  GET_LOGO_MAX = '/fdapi/outer-data/getCopyrightLogoMaxNumber'
}
export const getDistributeEnum = (params: any, cancelToken = true) => {
  params.accessToken = accessToken;
  return defineHttp.get<any>(
    {
      url: Api.GET_CATALOG_ENUM,
      params
    },
    {
      ignoreCancelToken: cancelToken
    }
  );
};
/**
 * 查询版权方logo数量限制
 * @param params
 */
export const esSearchLongVideo = (params: any) => {
  return defineHttp.post<Record<string, any>>(
    {
      url: Api.GET_ES_INFO,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};

/**
 * 查询版权方logo数量限制
 * @param params
 */
export const getLogoMaxNumber = () => {
  return defineHttp.get<Record<string, any>>(
    {
      url: Api.GET_LOGO_MAX
    },
    {
      ignoreCancelToken: false
    }
  );
};
