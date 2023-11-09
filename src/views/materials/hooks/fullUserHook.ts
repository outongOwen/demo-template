import type { Ref } from 'vue';
import type { CascaderOption } from 'naive-ui';
import { useContext } from '@/hooks';
const { useInject, useProvide } = useContext<Ref<CascaderOption[]>>('FullUserList', {
  native: true,
  readonly: false
});
export default function provideFullUserList() {
  const provideFullUserContext = (context: Ref<CascaderOption[]>) => {
    useProvide(context);
  };
  return {
    provideFullUserContext,
    injectFullUserContext: useInject
  };
}
