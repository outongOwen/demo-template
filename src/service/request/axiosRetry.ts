import type { AxiosError, AxiosInstance } from 'axios';
/**
 *  请求重试机制
 */

export class AxiosRetry {
  /**
   * 延迟
   */
  private delay(waitTime: number): Promise<any> {
    return new Promise<void>(resolve => {
      setTimeout(() => resolve(), waitTime);
    });
  }

  /**
   * 重试
   */
  retry(axiosInstance: AxiosInstance, error: AxiosError) {
    const { config } = error.response as any;
    const { waitTime, count } = config?.requestOptions?.retryRequest || {};
    config.retryCount = config.retryCount || 0;
    if (config.retryCount >= count) {
      return Promise.reject(error);
    }
    config.retryCount += 1;
    // 请求返回后config的header不正确造成重试请求失败,删除返回headers采用默认headers
    delete config.headers;
    return this.delay(waitTime).then(() => axiosInstance(config));
  }
}
