import type { ProxyOptions } from 'vite';
type ProxyTargetList = Record<string, ProxyOptions>;
/**
 * 设置网络代理
 * @param isOpenProxy - 是否开启代理
 * @param envConfig - env环境配置
 */
export function createViteProxy(isOpenProxy: boolean, envConfig: ServiceEnvConfig[]): ProxyTargetList | undefined {
  if (!isOpenProxy) return undefined;
  const proxy: ProxyTargetList = {};
  for (const { target, urlPrefix } of envConfig) {
    const isHttps = /^https:\/\//.test(target);
    // https://github.com/http-party/node-http-proxy#options
    proxy[urlPrefix] = {
      target,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${urlPrefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {})
    };
  }
  return proxy;
}
