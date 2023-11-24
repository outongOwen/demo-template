import type { App } from 'vue';
import setupNetworkDirective from './network';

/** setup custom vue directives. - [安装自定义的vue指令] */
export function setupDirectives(app: App) {
  setupNetworkDirective(app);
}
