/** 请求环境配置 */
type ServiceEnv = Record<ServiceEnvType, ServiceEnvConfig[]>;

/** 环境配置 */
const serviceEnv: ServiceEnv = {
  dev: [
    // 测试环境
    {
      url: 'http://localhost:8080',
      urlPrefix: '',
    },
  ],
  test: [
    {
      url: 'http://localhost:8080',
      urlPrefix: '',
    },
  ],
  prod: [
    {
      url: 'http://localhost:8080',
      urlPrefix: '',
    },
  ],
};

/**
 * 获取当前环境模式下的请求服务的配置
 * @param env 环境
 */
export function getServiceEnvConfig(env: ImportMetaEnv) {
  const { VITE_SERVICE_ENV = 'dev' } = env;

  const config = serviceEnv[VITE_SERVICE_ENV];

  return config;
}
