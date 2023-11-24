import type { MaybeElementRef } from '@vueuse/core';
import { unrefElement, useMagicKeys } from '@vueuse/core';
export default function useCssFullscreen(
  target?: MaybeElementRef,
  options?: {
    styles: Partial<CSSStyleDeclaration>;
  }
) {
  const targetRef = computed(() => unrefElement(target) ?? document.body);
  const { styles } = options ?? {};
  const isFullscreen = ref(false);
  // 批量设置样式
  const setStyle = (style: Partial<CSSStyleDeclaration>) => {
    Object.entries(style).forEach(([key, value]: [any, any]) => {
      targetRef.value.style[key] = value;
    });
  };
  // 清空样式
  const clearStyle = () => {
    targetRef.value.removeAttribute('style');
  };
  // 设置全屏
  const enter = () => {
    if (isFullscreen.value) return;
    setStyle({
      width: '100%',
      height: '100%',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '99',
      ...styles
    });
    isFullscreen.value = true;
  };
  // 退出全屏
  const exit = () => {
    if (!isFullscreen.value) return;
    clearStyle();
    isFullscreen.value = false;
  };
  // 切换全屏
  const toggleFullscreen = () => {
    isFullscreen.value ? exit() : enter();
  };
  // 快捷键事件监听(esc退出)
  const { escape } = useMagicKeys();
  watchEffect(() => {
    escape.value && isFullscreen.value && exit();
  });
  return {
    toggleFullscreen,
    enter,
    exit,
    isFullscreen
  };
}
