import compressBuild from 'rollup-plugin-compression';
import type { ICompressionOptions } from 'rollup-plugin-compression';

export default (viteEnv: ImportMetaEnv) => {
  const { VITE_APP_NAME, VITE_COMPRESSION_TYPE = 'zip' } = viteEnv;
  const option: ICompressionOptions = {
    sourceName: VITE_APP_NAME,
    type: VITE_COMPRESSION_TYPE,
    targetName: VITE_APP_NAME
  };
  return compressBuild(option);
};
