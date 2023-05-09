declare namespace Service {
  type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;
  interface RetryRequest {
    isOpenRetry: boolean;
    count: number;
    waitTime: number;
  }
  interface RequestOptions {
    // 将请求参数拼接到URL
    joinParamsToUrl?: boolean;
    // 格式请求参数时间
    formatDate?: boolean;
    // 是否处理请求结果
    isTransformResponse?: boolean;
    // 是否返回本机响应头部
    // 例如：当您需要获取响应头时，使用此属性
    isReturnNativeResponse?: boolean;
    // 是否加入url
    joinPrefix?: boolean;
    // 接口地址，如果将其留空，则使用默认apiUrl
    apiUrl?: string;
    // 请求拼接路径
    urlPrefix?: string;
    // 错误消息提示类型
    errorMessageMode?: ErrorMessageMode;
    // 是否添加时间戳
    joinTime?: boolean;
    // 忽略重复请求
    ignoreCancelToken?: boolean;
    // 是否发送标头中的令牌
    withToken?: boolean;
    // 请求重试机制
    retryRequest?: RetryRequest;
  }
  interface Result<T = any> {
    code: number | string;
    msg: string;
    data: T;
    success: boolean;
  }
  // 多部分/表单数据：上载文件
  interface UploadFileParams {
    // 其他参数
    data?: Recordable;
    // 文件参数接口字段名
    name?: string;
    // 文件
    file: File | Blob;
    // 文件名称
    filename?: string;
    [key: string]: any;
  }
  /** mock示例接口类型：后端接口返回的数据的类型 */
  /** mock的响应option */
  interface MockOption {
    url: Record<string, any>;
    body: Record<string, any>;
    query: Record<string, any>;
    headers: Record<string, any>;
  }
}
