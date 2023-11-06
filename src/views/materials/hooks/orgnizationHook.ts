import type { CascaderOption } from 'naive-ui';
import { useContext } from '@/hooks';

const { useInject, useProvide } = useContext<CascaderOption[] | undefined>('FirstOrgList', {
  native: true
});
export default function provideFirstOrgList() {
  const provideFirstOrgContext = (context: CascaderOption[] | undefined) => {
    useProvide(context);
  };
  return {
    provideFirstOrgContext,
    injectFirstOrgContext: useInject
  };
}
