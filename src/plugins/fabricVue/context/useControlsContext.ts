import type { FControlProps, TControlSet, ControlsVisibility } from '../types';
import { useContext } from '../hooks';
export interface ControlsContextProps {
  controlProps: FControlProps;
  controls: TControlSet;
  controlsVisibility: ControlsVisibility;
}
export interface ControlsContext {
  provideControlsContext: (context: ControlsContextProps) => void;
  injectControlsContext: () => ControlsContextProps | undefined;
}
const { useInject, useProvide } = useContext<ControlsContextProps>('ControlsContext', {
  native: true
});
export default function useControlsContext(): ControlsContext {
  const provideControlsContext = (context: ControlsContextProps) => {
    useProvide(context);
  };
  const injectControlsContext = () => {
    return useInject();
  };
  return {
    provideControlsContext,
    injectControlsContext
  };
}
