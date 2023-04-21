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
