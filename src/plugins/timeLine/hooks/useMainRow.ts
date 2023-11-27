import { toReactive, unrefElement, useElementBounding } from '@vueuse/core';
import type { MaybeComputedElementRef } from '@vueuse/core';
import { useTimeLineStateContext, useTimeLineContext } from '../contexts';
export default function useMainRow(mainRowRef: MaybeComputedElementRef) {
  const { injectTimeLineStateContext } = useTimeLineStateContext();
  const timeLineStateContext = injectTimeLineStateContext();
  const { injectTimeLineContext } = useTimeLineContext();
  const timeLineContext = injectTimeLineContext();
  const { mainRowBackground, leftOffset } = toReactive(timeLineContext);
  const { scrollBarSize } = toReactive(timeLineStateContext);
  const elementBounding = useElementBounding(mainRowRef);
  // 设置主时间轴的位置
  const setMainRowPos = () => {
    const el = unrefElement(mainRowRef);
    if (el) {
      el.style.position = 'sticky';
      el.style.bottom = '0';
      el.style.overflow = 'hidden';
    }
  };
  // 检测主时间轴是否在视口底部
  const checkMainRowBottom = () => {
    nextTick(() => {
      const el = unrefElement(mainRowRef);
      if (el) {
        // 获取当前视口高度（不包含滚动条）
        const clientHeight = document.documentElement.clientHeight;
        const { bottom: mainRowBottom } = el.getBoundingClientRect();
        if (mainRowBottom + scrollBarSize >= clientHeight) {
          el.style.backgroundColor = mainRowBackground ? mainRowBackground : '';
          if (el.id === 'timeLine-main-row') {
            el.style.marginLeft = '';
            el.style.paddingLeft = `${leftOffset}px`;
          }
        } else {
          el.style.backgroundColor = '';
          if (el.id === 'timeLine-main-row') {
            el.style.marginLeft = `${leftOffset}px`;
            el.style.paddingLeft = '';
          }
        }
      }
    });
  };
  watch(
    () => unrefElement(mainRowRef),
    el => {
      el && setMainRowPos();
    }
  );
  watch(
    elementBounding.bottom,
    () => {
      checkMainRowBottom();
    },
    {
      immediate: true
    }
  );
  return {
    checkMainRowBottom
  };
}
