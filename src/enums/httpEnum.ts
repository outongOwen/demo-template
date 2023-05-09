/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = '0',
  ERROR = '-1',
  TIMEOUT = 401,
  TYPE = 'success'
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

/**
 * @description:  contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}
export enum ErrorMessageEnum {
  OPERATION_FAILED = '操作失败',
  ERROR_TIP = '错误提示',
  ERROR_MESSAGE = '操作失败,系统异常!',
  TIMEOUT_MESSAGE = '登录超时,请重新登录!',
  API_TIMEOUT_MESSAGE = '接口请求超时,请刷新页面重试!',
  API_REQUEST_FAILED = '请求出错，请稍候重试',
  NETWORK_EXCEPTION = '网络异常',
  NETWORK_EXCEPTION_MSG = '网络异常，请检查您的网络连接是否正常!',
  ERR_MSG401 = '登录已过期，请在管理平台登录后，再访问此页面！',
  ERR_MSG403 = '用户得到授权，但是访问是被禁止的。!',
  ERR_MSG404 = '网络请求错误,未找到该资源!',
  ERR_MSG405 = '网络请求错误,请求方法未允许!',
  ERR_MSG408 = '网络请求超时!',
  ERR_MSG500 = '服务器错误,请联系管理员!',
  ERR_MSG501 = '网络未实现!',
  ERR_MSG502 = '网络错误!',
  ERR_MSG503 = '服务不可用，服务器暂时过载或维护!',
  ERR_MSG504 = '网络超时!',
  ERR_MSG505 = 'http版本不支持该请求!'
}
