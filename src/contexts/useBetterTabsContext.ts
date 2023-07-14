import { useContext } from '@/hooks';
export interface BetterTabsProps {
  contentHeight: Ref<number>;
}
const { useInject, useProvide } = useContext<BetterTabsProps>('BetterTabsContext', {
  native: true
});
export default function useBetterTabsContext() {
  const provideBetterTabsContext = (context: BetterTabsProps) => {
    useProvide(context);
  };
  const injectBetterTabsContext = () => {
    return useInject();
  };
  return {
    provideBetterTabsContext,
    injectBetterTabsContext
  };
}
