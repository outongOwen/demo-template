/**
 *
 * @param ms 毫秒时长
 * 格式化毫秒成分钟显示： 00:00
 */
const formatToMinute = (ms) => {
  const m = Math.floor(ms / 1000 / 60); // 分
  const s = Math.floor((ms - m * 60 * 1000) / 1000); // 秒
  const tempS = s >= 10 ? s : `0${s}`;
  const tempM = m >= 10 ? m : `0${m}`;
  return `${tempM}:${tempS}`;
};
/**
 * 格式化刻度时间
 * @param time ，单位ms
 */
export const formatTime = (time, fps = 25, unit = "f") => {
  let text = "";
  if (unit === "f") {
    const s = Math.round(time / (1000 / fps));
    if (!(s % fps)) {
      // 说明是是满足显示秒
      text = formatToMinute(time);
    } else {
      text = `${s % fps}f`;
    }
  } else {
    text = formatToMinute(time);
  }
  return text;
};
