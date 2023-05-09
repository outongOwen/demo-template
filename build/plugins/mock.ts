import { viteMockServe } from 'vite-plugin-mock';

export default () => {
  return viteMockServe({
    ignore: /^\\_/,
    mockPath: 'mock',
    injectCode: `
      import { setupMockServer } from '../mock';
      setupMockServer();
    `
  });
};
