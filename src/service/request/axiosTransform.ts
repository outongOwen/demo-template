/**
 * 数据处理类，可以根据工程配置
 */
import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string;
  transform?: AxiosTransform;
  requestOptions?: Service.RequestOptions;
}

export abstract class AxiosTransform {
  /**
   * @description: 请求前的流程配置
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: Service.RequestOptions) => AxiosRequestConfig;

  /**
   * @description: 请求已成功处理
   */
  transformRequestHook?: (res: AxiosResponse<Service.Result>, options: Service.RequestOptions) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: Service.RequestOptions) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: InternalAxiosRequestConfig, options: CreateAxiosOptions) => InternalAxiosRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: Error) => void;
}
