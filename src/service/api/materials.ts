import type { CascaderOption } from 'naive-ui';
import { defineHttp } from '@/service/request';

enum Api {
  GET_CATALOG_MEDIUM_LIST = '/openapi/media-editor/catalogMedium/list',
  GET_FIRST_ORG_INFO = '/api/user-permission/getFirstOrgInfo',
  GET_SECOND_ORG_INFO = '/api/user-permission/getSecondOrgInfo',
  GET_USER_BIND_LIST = '/api/user-permission/getUserBindList',
  GET_PRE_STATUS = '/openapi/media-editor/pretreatmentAndPro/status',
  TRANS_PRE = '/openapi/media-editor/pretreatment',
  TRANS_PRE_FAVORITE = '/api/material-product/favorite/pretreatment',
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
  return defineHttp.get<CascaderOption[]>(
    {
      url: Api.GET_USER_BIND_LIST,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};
// 获取预处理状态轮询接口
export const getPreStatus = (params: any) => {
  return defineHttp.get<CascaderOption[]>(
    {
      url: Api.GET_PRE_STATUS,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
}

// 视频素材接口
// 预处理
export const addVideoPretreatment = (params: any) => {
  return defineHttp.get<CascaderOption[]>(
    {
      url: Api.TRANS_PRE_FAVORITE,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
}
// 预处理接口，针对打点拆条工具收藏的视频（内容运营添加的视频）
// 20230823;收藏视频预处理接口统一
export const favoritePretreatment = (params: any) => {
  return defineHttp.get<CascaderOption[]>(
    {
      url: Api.TRANS_PRE_FAVORITE,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
}
