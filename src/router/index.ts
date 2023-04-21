import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { createRouterGuard } from './guard';
import { constantRoutes } from './routes';
const { VITE_HASH_ROUTE = 'N', VITE_BASE_URL } = import.meta.env;

export const router = createRouter({
  history: VITE_HASH_ROUTE === 'Y' ? createWebHashHistory(VITE_BASE_URL) : createWebHistory(VITE_BASE_URL),
  routes: constantRoutes as Array<RouteRecordRaw>
});

/** setup vue router. - [安装vue路由] */
export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}
/** 路由名称 */
export const routeName = (key: AuthRoute.AllRouteKey) => key;
