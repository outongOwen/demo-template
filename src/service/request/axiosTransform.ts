/**
 * 数据处理类，可以根据工程配置
 */
import type { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string;
  transform?: AxiosTransform;
  requestOptions?: Service.RequestOptions;
}

export abstract class AxiosTransform {
  /**
   * A function that is called before a request is sent. It can modify the request configuration as needed.
   * 在发送请求之前调用的函数。它可以根据需要修改请求配置。
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: Service.RequestOptions) => AxiosRequestConfig;

  /**
   * @description: 处理响应数据
   */
  transformResponseHook?: (res: AxiosResponse<Service.Result>, options: Service.RequestOptions) => any;

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
  responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: Error) => void;
}
