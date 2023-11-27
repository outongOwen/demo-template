/**
 * This function takes a base URL and an object, and returns a URL with the object's key-value pairs as
 * query parameters.
 * @param {string} baseUrl - A string representing the base URL to which the object parameters will be
 * appended.
 * @param {any} obj - The `obj` parameter is an object containing key-value pairs that will be
 * converted into URL parameters. Each key-value pair represents a parameter and its value.
 * @returns a string that is the concatenation of the `baseUrl` and the `obj` properties formatted as
 * URL parameters. The `obj` properties are encoded using `encodeURIComponent()` and the resulting
 * string is returned.
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      // 使用 hasOwnProperty 进行过滤
      parameters += `${key}=${encodeURIComponent(obj[key])}&`;
    }
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

// 取出cookie
export function getCookie(cname: any) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}
// 获取url参数
export const getQueryString = (name: string): any => {
  const reg: any = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const res: any = window.location.search.substr(1).match(reg);
  if (res !== null) {
    return decodeURIComponent(res[2]);
  }
  return null;
};

// 将Json转query
export const jsonToQuery = (data: any) => {
  const strArr: any = [];
  // eslint-disable-next-line guard-for-in
  for (const k in data) {
    const str = `${k}=${data[k]}`;
    strArr.push(str);
  }
  return strArr.join('&');
};
