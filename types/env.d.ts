/**
 *后台服务的环境类型
 * - dev: 后台开发环境
 * - test: 后台测试环境
 * - prod: 后台生产环境
 */
type ServiceEnvType = 'dev' | 'test' | 'prod';

/** 后台服务的环境配置 */
interface ServiceEnvConfig {
  /** 请求地址 */
  target: string;
  /** 匹配路径的正则字符串, 用于拦截地址转发代理(任意以 /开头 + 字符串, 单个/不起作用) */
  urlPrefix: string;
}

interface ImportMetaEnv {
  /** 项目基本地址 */
  readonly VITE_BASE_URL: string;
  /** 项目名称 */
  readonly VITE_APP_NAME: string;
  /** 项目标题 */
  readonly VITE_APP_TITLE: string;
  /** 项目描述 */
  readonly VITE_APP_DESC: string;
  /** 路由首页的路径 */
  readonly VITE_ROUTE_HOME_PATH: AuthRoute.RoutePath;
  /** iconify图标作为组件的前缀 */
  readonly VITE_ICON_PREFFIX: string;
  /**
   * 本地SVG图标作为组件的前缀, 请注意一定要包含 VITE_ICON_PREFFIX
   * - 格式 {VITE_ICON_PREFFIX}-{本地图标集合名称}
   * - 例如：icon-local
   */
  readonly VITE_ICON_LOCAL_PREFFIX: string;
  /** 是否开启权限校验 */
  readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic';
  /** 后端服务的环境类型 */
  readonly VITE_SERVICE_ENV?: ServiceEnvType;
  /** 开启请求代理 */
  readonly VITE_HTTP_PROXY?: 'Y' | 'N';
  /** hash路由模式 */
  readonly VITE_HASH_ROUTE?: 'Y' | 'N';
  /** 开启mock */
  readonly VITE_USE_MOCK?: 'Y' | 'N';
  /** 全局请求前缀 */
  readonly VITE_GLOB_API_URL_PREFIX?: string;
  /** 是否开启压缩 */
  readonly VITE_COMPRESS?: 'Y' | 'N';
  /** 压缩算法类型 */
  readonly VITE_COMPRESS_TYPE?: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw';
  /** 是否开启打包文件压缩 */
  readonly VITE_COMPRESSION?: 'Y' | 'N';
  /** 文件打包文件类型 */
  readonly VITE_COMPRESSION_TYPE?: 'zip' | 'tar';
  /** 是否应用pwa */
  readonly VITE_PWA?: 'Y' | 'N';
  /** 是否开启打包文件大小结果分析 */
  readonly VITE_VISUALIZER?: 'Y' | 'N';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
