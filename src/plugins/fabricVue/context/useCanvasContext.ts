import type { Canvas } from 'fabric';
import { useContext } from '../hooks';
export interface CanvasContextProps {
  instance: Canvas;
  renderAll: () => void;
  requestRenderAll: () => void;
}
export interface CanvasContext {
  provideCanvasContext: (context: CanvasContextProps) => void;
  injectCanvasContext: () => CanvasContextProps | undefined;
}
const { useInject, useProvide } = useContext<CanvasContextProps>('CanvasContext', {
  native: true
});
export default function useCanvasContext(): CanvasContext {
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
