import { controlsUtils } from 'fabric';
import type { FabricObject, TFabricObjectProps } from '../types';
import { useControlsContext } from '../context';
import { extractFabricObjectProps } from '../utils';
const controlsKeys = [
  'cornerSize',
  'touchCornerSize',
  'transparentCorners',
  'cornerColor',
  'cornerStrokeColor',
  'cornerStyle',
  'cornerDashArray',
  'padding',
  'hasControls'
];
export const useControls = () => {
  const { injectControlsContext } = useControlsContext();
  const controlsInject = injectControlsContext();
  const setControls = (fabricObject: FabricObject, fabricObjectProps: TFabricObjectProps = {}) => {
    const controlProps = controlsInject?.controlProps ?? {};
    const controls = controlsInject?.controls ?? {};
    const controlsVisibility = controlsInject?.controlsVisibility ?? {};
    fabricObject.controls = {
      ...controlsUtils.createObjectDefaultControls(),
      ...controls
    };
    const controlsProps = extractFabricObjectProps(fabricObjectProps, controlsKeys);
    fabricObject.set({ ...controlProps, ...controlsProps });
    fabricObject.setControlsVisibility(controlsVisibility);
  };
  return {
    setControls
  };
};
