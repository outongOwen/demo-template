import { useContext } from '../hooks';
export interface PayerProps {
  isFullscreen: boolean;
}
const { useInject, useProvide } = useContext<PayerProps>('timeLineContext');
export default function useTimeLineContext() {
  const provideTimeLineContext = (context: PayerProps) => {
    useProvide(context);
  };
  const injectTimeLineContext = () => {
    return useInject();
  };
  return {
    provideTimeLineContext,
    injectTimeLineContext
  };
}
