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
  isCustomizeInfoColor: false
};

export const themeSetting = defaultThemeSetting;
