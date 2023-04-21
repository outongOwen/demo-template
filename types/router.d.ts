import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /** 路由标题(可用来作document.title或者菜单的名称) */
    title: string;
    /** 路由的动态路径(需要动态路径的页面需要将path添加进范型参数) */
    dynamicPath?: any;
    /** 作为单级路由的父级路由布局组件 */
    singleLayout?: 'basic' | 'blank';
    /** 需要登录权限 */
    requiresAuth?: boolean;
    /**
     * 哪些类型的用户有权限才能访问的路由(空的话则表示不需要权限)
     * @description 后端动态路由数据不需要该属性，直接由后端根据用户角色返回对应权限的路由数据
     */
    permissions?: any;
    /** 缓存页面 */
    keepAlive?: boolean;
    /** 菜单和面包屑对应的图标 */
    icon?: string;
    /** 使用本地svg作为的菜单和面包屑对应的图标(assets/svg-icon文件夹的的svg文件名) */
    localIcon?: string;
    /** 是否在菜单中隐藏(一些列表、表格的详情页面需要通过参数跳转，所以不能显示在菜单中) */
    hide?: boolean;
    /** 外链链接 */
    href?: string;
    /** 是否支持多个tab页签(默认一个，即相同name的路由会被替换) */
    multiTab?: boolean;
    /** 路由顺序，可用于菜单的排序 */
    order?: number;
    /** 表示是否是多级路由的中间级路由(用于转换路由数据时筛选多级路由的标识，定义路由时不用填写) */
    multi?: boolean;
    /** 是否固定在tab卡不可关闭  */
    affix?: boolean;
  }
}
