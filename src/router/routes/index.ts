import { EditorLayout } from '@/layouts/index';
const ErrorPage403 = () => import('@/views/exception/403/index.vue');
const ErrorPage404 = () => import('@/views/exception/404/index.vue');
const ErrorPage500 = () => import('@/views/exception/500/index.vue');
/** 根路由: / */
export const ROOT_ROUTE: AuthRoute.Route = {
  name: 'root',
  path: '/',
  redirect: import.meta.env.VITE_ROUTE_HOME_PATH,
  meta: {
    title: 'Root'
  }
};

/** 固定的路由 */
export const constantRoutes: AuthRoute.Route[] = [
  ROOT_ROUTE,
  {
    name: 'main',
    path: '/main',
    component: EditorLayout,
    meta: {
      title: '主页',
      singleLayout: 'blank'
    }
  },
  {
    name: '403',
    path: '/403',
    component: ErrorPage403,
    meta: {
      title: '无权限',
      singleLayout: 'blank'
    }
  },
  {
    name: '404',
    path: '/404',
    component: ErrorPage404,
    meta: {
      title: '未找到',
      singleLayout: 'blank'
    }
  },
  {
    name: '500',
    path: '/500',
    component: ErrorPage500,
    meta: {
      title: '服务器错误',
      singleLayout: 'blank'
    }
  },
  // 匹配无效路径的路由
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: ErrorPage403,
    meta: {
      title: '未找到',
      singleLayout: 'blank'
    }
  }
];
