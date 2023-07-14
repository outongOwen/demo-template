import { useContext } from '@/hooks';
export interface TrackProps {
  scrollTop: number;
}
const { useInject, useProvide } = useContext<TrackProps>('TrackContext', {
  native: true
});
export default function useTrackContext() {
  const provideTrackContext = (context: TrackProps) => {
    useProvide(context);
  };
  const injectTrackContext = () => {
    return useInject();
  };
  return {
    provideTrackContext,
    injectTrackContext
  };
}
