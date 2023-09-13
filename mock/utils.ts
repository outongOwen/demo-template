// Interface data format used to return a unified format
import { ceil } from 'lodash';
import { ResultEnum } from '@/enums';
export function resultSuccess<T = Recordable>(data: T, { msg = 'ok' } = {}): Service.Result<T> {
  return {
    code: ResultEnum.SUCCESS,
    data,
    msg,
    success: true
  };
}

export function resultPageSuccess<T = any>(page: number, pageSize: number, list: T[]) {
  const pageData = pagination(page, pageSize, list);
  return {
    ...resultSuccess({
      content: pageData,
      totalPages: ceil(list.length / pageSize),
      totalElements: list.length,
      page: Number(page)
    })
  };
}

export function resultError(msg = 'Request failed', { code = ResultEnum.ERROR, data = null } = {}): Service.Result {
  return {
    code,
    data,
    msg,
    success: false
  };
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * Number(pageSize);
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + Number(pageSize));
}

/** mock示例接口类型：后端接口返回的数据的类型 */
/** mock的响应option */
export interface MockOption {
  url: Record<string, any>;
  body: Record<string, any>;
  query: Record<string, any>;
  headers: Record<string, any>;
}
