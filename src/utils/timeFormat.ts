export function formatFrameByTime(duration = 0, format = 'str', fps = 25) {
  const HOUR = 3600000;
  const MINUTE = 60000;
  const SECOND = 1000;
  const h = Math.floor(duration / HOUR);
  const m = Math.floor((duration % HOUR) / MINUTE);
  const s = Math.floor(((duration % HOUR) % MINUTE) / SECOND);
  const frameNumber = Math.floor(((duration % HOUR) % SECOND) / (SECOND / fps));
  const ms = Math.floor((duration % HOUR) % SECOND);
  if (format === 'str') {
    const pad2 = (n: number) => n.toString().padStart(2, '0');
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}.${pad2(frameNumber)}`;
  }
  if (format === 'strMs') {
    return `${h}:${m}:${s}.${ms}`;
  }
  return { h, m, s, frameNumber, ms };
}
