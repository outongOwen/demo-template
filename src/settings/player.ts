const defaultPlayerSettings: Player.Setting = {
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

export const playerSettings = defaultPlayerSettings;
