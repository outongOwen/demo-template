import { inject, provide, reactive, readonly as defineReadonly } from 'vue';
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
export interface CreateContextOptions {
  readonly?: boolean; // 是否只读
  native?: boolean; // 是否原生
}

export function useContext<T>(contextName = 'context', options: CreateContextOptions = {}) {
  const injectKey: InjectionKey<T> = Symbol(contextName);
  function useProvide(context: T) {
    const { readonly = true, native = false } = options;
    const state = reactive(context as never);
    const provideData = readonly ? defineReadonly(state) : context;
    provide(injectKey, native ? context : (provideData as T | Readonly<T>));
    return { state };
  }
  function useInject() {
    return inject(injectKey);
  }
  return { useProvide, useInject };
}
