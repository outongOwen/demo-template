import { useContext } from '../hooks';
import type { TimelineEditorProps } from '../types';
export interface TimeLineContextProps extends TimelineEditorProps {}
const { useInject, useProvide } = useContext<TimeLineContextProps>('TimeLineContext', {
  native: false,
  readonly: false
});
export default function useTimeLineContext() {
  const provideTimeLineContext = (context: TimeLineContextProps) => {
    useProvide(context);
  };
  const injectTimeLineContext = (): TimeLineContextProps => {
    return useInject();
  };
  return {
    provideTimeLineContext,
    injectTimeLineContext
  };
}
