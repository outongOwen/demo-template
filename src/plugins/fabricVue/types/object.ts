import type { Object as FabricObject } from 'fabric';
import type { TFabricObjectProps, SerializedObjectProps, TProps } from '@fabric/shapes/Object/types';
export { TFabricObjectProps, SerializedObjectProps, TProps, FabricObject };
export type TObjectInstance<T> = T & Record<string, any>;
