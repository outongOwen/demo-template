import { useContext } from '../hooks';
import type { TimelineEditorProps } from '../types';
export interface TimeLineContextProps extends TimelineEditorProps {}
const { useInject, useProvide } = useContext<TimeLineContextProps>('TimeLineContext', {
  native: true
});
export default function useTimeLineContext() {
  const provideTimeLineContext = (context: TimeLineContextProps) => {
    const { state } = useProvide(context);
    return state;
  };
  const injectTimeLineContext = (): TimeLineContextProps => {
    return useInject();
  };
  return {
    provideTimeLineContext,
    injectTimeLineContext
  };
}
