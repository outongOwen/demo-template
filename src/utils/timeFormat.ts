export function formatFrameByTime(time = 0, fps = 25, format: 'fps' | 'ms' = 'fps') {
  const HOUR = 3600000;
  const MINUTE = 60000;
  const SECOND = 1000;
  const h = Math.floor(time / HOUR);
  const m = Math.floor((time % HOUR) / MINUTE);
  const s = Math.floor(((time % HOUR) % MINUTE) / SECOND);
  const ms = Math.floor((time % HOUR) % SECOND);
  // 取整规则：向下取整
  const frameCount = Math.floor((time % SECOND) / (SECOND / fps));
  if (format === 'fps') {
    const pad2 = (n: number) => n.toString().padStart(2, '0');
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}:${pad2(frameCount)}`;
  }
  if (format === 'ms') {
    return `${h}:${m}:${s}.${ms}`;
  }
  return { h, m, s, frameCount, ms };
}
