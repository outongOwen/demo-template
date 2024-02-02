/** 请求环境配置 */
type ServiceEnv = Record<ServiceEnvType, ServiceEnvConfig[]>;
/** 环境配置 */
const serviceEnv: ServiceEnv = {
  dev: [
    // 测试环境
    {
      urlPrefix: '^/openapi',
      target: 'http://36.155.98.104:18901/openapi'
    },
    {
      urlPrefix: '^/api',
      target: 'http://36.155.98.104:18901/api',
    }
  ],
  test: [
    {
      target: 'http://localhost:8200',
      urlPrefix: ''
    }
  ],
  prod: [
    {
      target: 'http://localhost:8200',
      urlPrefix: ''
    }
  ]
};

/**
 * 获取当前环境模式下的请求服务的配置
 * @param env 环境
 */
export function getServiceEnvConfig(env: ImportMetaEnv): ServiceEnvConfig[] {
  const { VITE_SERVICE_ENV = 'dev' } = env;

  const config = serviceEnv[VITE_SERVICE_ENV];

  return config;
}
