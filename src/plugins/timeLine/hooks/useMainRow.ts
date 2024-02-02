// import { toReactive, unrefElement, useElementBounding } from '@vueuse/core';
import type { MaybeComputedElementRef } from '@vueuse/core';
// import { useTimeLineContext } from '../contexts';
export default function useMainRow(mainRowRef: MaybeComputedElementRef) {
  console.log(mainRowRef);
  // const { injectTimeLineContext } = useTimeLineContext();
  // const timeLineContext = injectTimeLineContext();
  // const { mainRowBackground, leftOffset } = toReactive(timeLineContext);
  // const elementBounding = useElementBounding(mainRowRef);
  // // 设置主时间轴的位置
  // const setMainRowPos = (el, state: boolean) => {
  //   if (state) {
  //     el.style.position = 'sticky';
  //     el.style.bottom = '0';
  //     el.style.overflow = 'hidden';
  //   }
  //   if (!state) {
  //     el.style.position = '';
  //     el.style.bottom = '';
  //     el.style.overflow = '';
  //   }
  // };
  // // 检测主时间轴是否在视口底部
  // const checkMainRowBottom = () => {
  //   nextTick(() => {
  //     const el = unrefElement(mainRowRef);
  //     if (el) {
  //       const clientHeight = document.documentElement.clientHeight;
  //       const { bottom: mainRowBottom } = el.getBoundingClientRect();
  //       // 获取滚动条高度
  //       if (mainRowBottom + 8 >= clientHeight) {
  //         el.style.backgroundColor = mainRowBackground ? mainRowBackground : '';
  //         if (el.id === 'timeLine-main-row') {
  //           el.style.marginLeft = '';
  //           el.style.paddingLeft = `${leftOffset}px`;
  //         }
  //       } else {
  //         el.style.backgroundColor = '';
  //         if (el.id === 'timeLine-main-row') {
  //           el.style.marginLeft = `${leftOffset}px`;
  //           el.style.paddingLeft = '';
  //         }
  //       }
  //     }
  //   });
  // };
  // watch(
  //   () => unrefElement(mainRowRef),
  //   (el, oldEl) => {
  //     el && setMainRowPos(el, true);
  //     !el && oldEl && setMainRowPos(oldEl, false);
  //   }
  // );
  // watch(
  //   elementBounding.bottom,
  //   () => {
  //     checkMainRowBottom();
  //   },
  //   {
  //     immediate: true
  //   }
  // );
  // return {
  //   checkMainRowBottom
  // };
}
