import { unrefElement } from '@vueuse/core';
import type { DragEvent, ResizeEvent } from '@interactjs/types';
import type { MaybeElement } from '@vueuse/core';

export function useAutoScroll(target: MaybeElement) {
  const DEFAULT_SPEED = 1;
  const MAX_SPEED = 3;
  const CRITICAL_SIZE = 10;
  const leftBoundRef = ref(Number.MIN_SAFE_INTEGER);
  const rightBoundRef = ref(Number.MAX_SAFE_INTEGER);

  const speed = ref(DEFAULT_SPEED);
  const frame = ref<number>();

  const initAutoScroll = () => {
    const el = unrefElement(target);
    if (el) {
      const { left, width } = el.getBoundingClientRect();
      leftBoundRef.value = left;
      rightBoundRef.value = left + width;
    }
  };

  const dealDragAutoScroll = (e: DragEvent, deltaScroll?: (delta: number) => void) => {
    // 超出
    if (e.clientX >= rightBoundRef.value || e.clientX <= leftBoundRef.value) {
      frame.value && cancelAnimationFrame(frame.value);
      const over = Math.abs(
        e.clientX >= rightBoundRef.value ? e.clientX - rightBoundRef.value : e.clientX - leftBoundRef.value
      );
      speed.value = Math.min(Number((over / CRITICAL_SIZE).toFixed(0)) * DEFAULT_SPEED, MAX_SPEED);

      const dir = e.clientX >= rightBoundRef.value ? 1 : -1;
      const delta = dir * speed.value;
      const loop = () => {
        deltaScroll && deltaScroll(delta);
        frame.value = requestAnimationFrame(loop);
      };

      frame.value = requestAnimationFrame(loop);
      return false;
    }
    frame.value && cancelAnimationFrame(frame.value);

    return true;
  };

  const dealResizeAutoScroll = (e: ResizeEvent, _dir: 'left' | 'right', deltaScroll?: (delta: number) => void) => {
    if (e.clientX >= rightBoundRef.value || e.clientX < leftBoundRef.value) {
      frame.value && cancelAnimationFrame(frame.value);
      const over = Math.abs(
        e.clientX >= rightBoundRef.value ? e.clientX - rightBoundRef.value : e.clientX - leftBoundRef.value
      );
      speed.value = Math.min(Number((over / CRITICAL_SIZE).toFixed(0)) * DEFAULT_SPEED, MAX_SPEED);

      const direction = e.clientX >= rightBoundRef.value ? 1 : -1;
      const delta = direction * speed.value;
      const loop = () => {
        deltaScroll && deltaScroll(delta);
        frame.value = requestAnimationFrame(loop);
      };

      frame.value = requestAnimationFrame(loop);

      return false;
    }
    frame.value && cancelAnimationFrame(frame.value);

    return true;
  };

  const stopAutoScroll = () => {
    leftBoundRef.value = Number.MIN_SAFE_INTEGER;
    rightBoundRef.value = Number.MAX_SAFE_INTEGER;
    speed.value = DEFAULT_SPEED;
    frame.value && cancelAnimationFrame(frame.value);
  };

  return {
    initAutoScroll,
    dealDragAutoScroll,
    dealResizeAutoScroll,
    stopAutoScroll
  };
}
