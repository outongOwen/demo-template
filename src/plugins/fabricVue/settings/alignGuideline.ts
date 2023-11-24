export const alignGuidelineSettings = {
  aligningLineOffset: 5,
  aligningLineMargin: 10,
  aligningLineWidth: 2,
  aligningLineColor: '#fff',
  aligningLineColorBase: '#fff'
} as const;
export type AlignGuidelineSettings = typeof alignGuidelineSettings;
export default alignGuidelineSettings;
