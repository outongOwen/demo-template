import { Canvas, config } from 'fabric';
import type { TConfiguration } from '@fabric/config';
export interface FConfiguration extends TConfiguration {}
export type FOptions = Record<string, any>;
export interface ICanvasVue extends Canvas {
  _initConfig: (configuration?: FConfiguration) => void;
}
// export type CanvasVue = Canvas;
export interface ICanvasVueOptions {
  el: string | HTMLCanvasElement;
  options?: FOptions;
  configuration?: FConfiguration;
  // plugins?: any[];
}
export class CanvasVue extends Canvas implements ICanvasVue {
  _initConfig(configuration?: FConfiguration) {
    configuration &&
      /**
       *  设置canvas的配置
       */
      Object.assign(config, configuration);
  }

  constructor(options: ICanvasVueOptions) {
    const { el, options: fOptions = {}, configuration = {} } = options;
    super(el, fOptions);
    this._initConfig(configuration);
  }
}
