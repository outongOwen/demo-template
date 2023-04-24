const themeColorList = ['#1890FF'];

const defaultThemeSetting: Theme.Setting = {
  darkMode: true,
  followSystemTheme: true,
  themeColor: themeColorList[0],
  themeColorList,
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  isCustomizeInfoColor: false,
  layoutMinWidth: 1200,
  layoutMinHeight: 540,
  header: {
    height: 50,
    minWidth: 1200
  },
  sliderMenu: {
    width: 100,
    viewMinWidth: 1200
  }
};

export const themeSetting = defaultThemeSetting;
