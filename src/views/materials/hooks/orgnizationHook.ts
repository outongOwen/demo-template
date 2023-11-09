import type { Ref } from 'vue';
import type { CascaderOption } from 'naive-ui';
import { useContext } from '@/hooks';
const { useInject, useProvide } = useContext<Ref<CascaderOption[]>>('FirstOrgList', {
  native: true,
  readonly: false
});
export default function provideFirstOrgList() {
  const provideFirstOrgContext = (context: Ref<CascaderOption[]>) => {
    useProvide(context);
  };
  return {
    provideFirstOrgContext,
    injectFirstOrgContext: useInject
  };
}
