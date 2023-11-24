import type { Object as FabricObject, TFabricObjectProps, SerializedObjectProps } from 'fabric';
export { TFabricObjectProps, SerializedObjectProps, FabricObject };
export type TObjectInstance<T> = T & Record<string, any>;
