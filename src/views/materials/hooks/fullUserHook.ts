import type { CascaderOption } from 'naive-ui';
import { useContext } from '@/hooks';

const { useInject, useProvide } = useContext<CascaderOption[] | undefined>('FullUserList', {
  native: true
});
export default function provideFullUserList() {
  const provideFullUserContext = (context: CascaderOption[] | undefined) => {
    useProvide(context);
  };
  return {
    provideFullUserContext,
    injectFullUserContext: useInject
  };
}
