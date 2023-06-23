declare namespace GlobalMenuOptions {
  interface AeaConfig {
    /** 二级菜单 */
    secondMenu: boolean;
    /** 搜索表单 */
    searchForm: boolean;
    /** 材料区域 */
    materialBody: boolean;
  }
  interface FormSchema {
    name: string;
    label: string;
    type: 'input' | 'select';
    options?: Array<import('naive-ui').SelectOption | import('naive-ui').SelectGroupOption>;
  }
  interface ListSchema {
    width?: number;
    height?: number;
    gutter?: number;
    pageSize?: number;
  }
  interface SecondMenuOptions {
    label: string;
    key?: string;
    icon?: string | import('@iconify/vue').IconifyIcon;
    [key: string]: unknown;
  }
  type ExtendMenuOptions = {
    /** 二级菜单 */
    secondMenuOptions?: SecondMenuOptions[];
    /** 区域配置 */
    areaConfig: AeaConfig;
    /** 是否缓存 */
    isKeepAlive?: boolean;
    /** 查询条件 */
    searchModel?: Record<string, unknown>;
    /** 列表配置 */
    listSchema?: ListSchema;
    /** 是否为本地配置 */
    isLocal?: boolean;
    /** 列表查询规则 */
    // formSchema?: FormSchema[];
  } & import('naive-ui').MenuOption;
}
