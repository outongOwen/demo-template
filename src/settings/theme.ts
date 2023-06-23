const themeColorList = ['#1890FF'];

const defaultThemeSetting: Theme.Setting = {
  darkMode: true,
  followSystemTheme: false,
  themeColor: themeColorList[0],
  themeColorList,
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  isCustomizeInfoColor: true,
  layoutMinWidth: 0,
  layoutMinHeight: 540,
  header: {
    height: 50,
    minWidth: 1200
  },
  sliderMenu: {
    width: 80,
    viewMinWidth: 1200
  }
};

export const themeSetting = defaultThemeSetting;
