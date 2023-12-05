import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';
/**
 * @description: 创建一个vue的inject和provide上下文
 * @param {string} contextName
 * @param {CreateContextOptions} options
 * @return {ReturnType<useProvide>}
 * @example:
 * const { useProvide, useInject } = useContext<Context>('context');
 * const { state } = useProvide({} as Context);
 * const context = useInject();
 * context.state
 */

export default function useContext<T>(contextName = 'context') {
  const injectKey: InjectionKey<T> = Symbol(contextName);
  function useProvide(context: T) {
    provide(injectKey, context);
    return context;
  }
  function useInject() {
    return inject(injectKey) as T;
  }
  return { useProvide, useInject };
}
