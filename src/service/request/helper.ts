import { isObject, isString } from 'lodash-es';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object;

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}
/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Recordable) {
  if (!isObject(params)) {
    // 使用自定义的辅助函数 isObject 进行类型检查
    return;
  }

  const keys = Object.keys(params);
  for (const key of keys) {
    const value = params[key];

    // 判断是否有 format 方法且为函数类型
    const format = value?.format ?? null;
    if (format && typeof format === 'function') {
      params[key] = value.format(DATE_TIME_FORMAT);
    }

    if (isString(key)) {
      const valueToUpdate = params[key]; // 使用不同的变量名避免重复声明
      if (valueToUpdate) {
        try {
          params[key] = isString(valueToUpdate) ? valueToUpdate.trim() : valueToUpdate;
        } catch (error) {
          // 移除错误对象类型声明，TypeScript 会自动推断
          throw new Error(error as string);
        }
      }
    }

    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}
