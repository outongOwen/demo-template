import { useContext } from '@/hooks';
export interface PayerProps {
  isFullscreen: boolean;
}
const { useInject, useProvide } = useContext<PayerProps>('BetterTabsContext', {
  native: true
});
export default function usePlayerContext() {
  const provideBetterTabsContext = (context: PayerProps) => {
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
