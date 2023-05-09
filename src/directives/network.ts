import type { App, Directive } from 'vue';
import { ErrorMessageEnum } from '@/enums';

export default function setupNetworkDirective(app: App) {
  function listenerHandler(event: MouseEvent) {
    const hasNetwork = window.navigator.onLine;
    if (!hasNetwork) {
      window.$message?.error(ErrorMessageEnum.ERR_MSG404);
      event.stopPropagation();
    }
  }

  const networkDirective: Directive<HTMLElement, boolean | undefined> = {
    mounted(el: HTMLElement, binding) {
      if (binding.value === false) return;
      el.addEventListener('click', listenerHandler, { capture: true });
    },
    unmounted(el: HTMLElement, binding) {
      if (binding.value === false) return;
      el.removeEventListener('click', listenerHandler);
    }
  };

  app.directive('network', networkDirective);
}
