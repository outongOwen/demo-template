import { controlsUtils } from 'fabric';
import type { Object as FabricObject } from 'fabric';
import type { FabricObjectProps } from '@fabric/shapes/Object/types';
import { useControlsContext } from '../context';
export const useControls = () => {
  const { injectControlsContext } = useControlsContext();
  const controlsInject = injectControlsContext();
  const setControls = (fabricObject: FabricObject, objectProps: Partial<FabricObjectProps> = {}) => {
    const controlProps = controlsInject?.controlProps ?? {};
    const controls = controlsInject?.controls ?? {};
    const controlsVisibility = controlsInject?.controlsVisibility ?? {};
    fabricObject.controls = {
      ...controlsUtils.createObjectDefaultControls(),
      ...controls
    };
    fabricObject.set({ ...controlProps, ...objectProps });
    fabricObject.setControlsVisibility(controlsVisibility);
  };
  return {
    setControls
  };
};
