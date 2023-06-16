interface DefaultCanvasSettings {
  controls: Player.CanvasControlsSetting;
  alignGuidelines: Player.CanvasAlignGuidelinesSetting;
}
const defaultPlayerSettings: Player.BaseSetting = {
  frameRate: 60,
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
const defaultCanvasControlsSettings: Player.CanvasControlsSetting = {
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
};
const defaultCanvasAlignGuidelinesSettings: Player.CanvasAlignGuidelinesSetting = {
  autoAdsorb: true,
  aligningLineMargin: 5,
  aligningLineWidth: 1,
  aligningLineColor: '#fff',
  isOpenLineSign: true,
  isOpenAlignGuidelines: true,
  alignGuidelinesPreset: ['canvas', 'object', 'objectRotation'],
  lineSignOptions: {
    lineWidth: 0.5,
    size: 2.5,
    color: '#fff'
  },
  ignoreObjTypes: [],
  pickObjTypes: []
};
const defaultCanvasSettings: DefaultCanvasSettings = {
  controls: defaultCanvasControlsSettings,
  alignGuidelines: defaultCanvasAlignGuidelinesSettings
};
export const playerSettings = {
  ...defaultPlayerSettings,
  ...defaultCanvasSettings
};
