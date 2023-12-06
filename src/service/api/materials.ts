import type { CascaderOption } from 'naive-ui';
import { defineHttp } from '@/service/request';

enum Api {
  GET_CATALOG_MEDIUM_LIST = '/openapi/media-editor/catalogMedium/list',
  GET_FIRST_ORG_INFO = '/api/user-permission/getFirstOrgInfo',
  GET_SECOND_ORG_INFO = '/api/user-permission/getSecondOrgInfo',
  GET_USER_BIND_LIST = '/api/user-permission/getUserBindList',
  GET_PRE_STATUS = '/openapi/media-editor/pretreatmentAndPro/status',
  TRANS_PRE_FAVORITE = '/api/material-product/favorite/pretreatment',
  TRANS_PRE_TOOL = '/openapi/media-editor/pretreatment',
  ATTACHMENT_COMMON_TAG = '/api/material-product/attachment-common-tag/findAll',
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
// 获取贴图分类
export const getAttachmentTag = (params?: any) => {
  return defineHttp.get<CascaderOption[]>(
    {
      url: Api.ATTACHMENT_COMMON_TAG,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};
// 获取预处理状态轮询接口
export const getPreListStatus = (params: any) => {
  return defineHttp.get<CascaderOption[]>(
    {
      url: Api.GET_PRE_STATUS,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
};

// 视频素材接口
// 预处理 -- 收藏
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
// 视频素材接口
// 预处理 -- 非收藏
export const addVideoPretreatment = (params: any) => {
  return defineHttp.get<CascaderOption[]>(
    {
      url: Api.TRANS_PRE_TOOL,
      params
    },
    {
      ignoreCancelToken: false
    }
  );
}
