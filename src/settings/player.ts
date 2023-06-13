import type { FControlProps, ControlsVisibility } from '~/src/plugins/fabricVue/types';
interface DefaultCanvasSettings {
  controls: Required<FControlProps> & {
    visibility: ControlsVisibility;
  };
}
const defaultPlayerSettings: Player.Setting = {
  frameRate: 25,
  volume: 1,
  speed: 1,
  resolutionReferenceBase: 720,
  // 设置默认分辨率必须与比例一致
  defaultResolution: {
    width: 1280,
    height: 720
  },
  proportion: '16:9',
  maxResolution: 2520,
  minResolution: 480,
  shortestEdgeMaxResolution: 1080,
  shortestEdgeMinResolution: 480
};
const defaultCanvasSettings: DefaultCanvasSettings = {
  controls: {
    borderColor: '#fff',
    cornerColor: '#fff',
    cornerStrokeColor: '#fff',
    transparentCorners: false,
    touchCornerSize: 24,
    cornerSize: 13,
    cornerStyle: 'rect',
    cornerDashArray: null,
    borderScaleFactor: 2,
    padding: 0,
    hasControls: true,
    visibility: {
      ml: true,
      mr: true,
      mb: true,
      mt: true,
      tl: true,
      tr: true,
      bl: true,
      br: true,
      mtr: true
    }
  }
};
export const playerSettings = { ...defaultPlayerSettings, ...defaultCanvasSettings };
