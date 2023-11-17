import { defineHttp } from '@/service/request';
import {getQueryString} from "@/utils";
const accessToken = getQueryString('accessToken');

enum Api {
  GET_CATALOG_ENUM = '/openapi/media-editor/catalog/data',
  GET_ES_INFO = '/openapi/media-editor/esSearch',
}
export const getDistributeEnum = (params: any) => {
  params.accessToken = accessToken
  return defineHttp.get<Record<string, any>>(
    {
      url: Api.GET_CATALOG_ENUM,
      params
    }
  );
};

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
export const getDistributeAssemblyData = (params: any) => {
  return defineHttp.get<Record<string, any>>(
    {
      url: Api.GET_ES_INFO,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};
