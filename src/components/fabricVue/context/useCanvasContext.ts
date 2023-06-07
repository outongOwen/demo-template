import type { Canvas } from 'fabric';
import { useContext } from '../hooks';
export interface CanvasContextProps {
  instance: Canvas;
  renderAll: () => void;
  requestRenderAll: () => void;
}
const { useInject, useProvide } = useContext<CanvasContextProps>('CanvasContext', {
  native: true
});
export default function useCanvasContext() {
  const provideCanvasContext = (context: CanvasContextProps) => {
    useProvide(context);
  };
  const injectCanvasContext = () => {
    return useInject();
  };
  return {
    provideCanvasContext,
    injectCanvasContext
  };
}
