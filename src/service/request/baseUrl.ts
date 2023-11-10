/**
 * api 和 fdapi 使用主站token ;  openapi使用点播token
 */
let baseURL;
let gateWay;
const devGateWay = {
  // http://36.155.98.104
  api: '18901',
  fdapi: '18902',
  openapi: '18901',
  manapi: '19411'
};
const proGateWay = {
  // http://36.155.98.95
  api: '48080',
  fdapi: '8903',
  openapi: '8910',
  manapi: '8904'
};
const testGateWay = {
  api: 'http://192.168.230.207:8901',
  fdapi: 'http://192.168.230.207:8902',
  openapi: 'http://192.168.231.50:8770',
  manapi: 'http://192.168.231.50:9411'
};
if (import.meta.env.MODE === 'development') {
  gateWay = devGateWay;
  baseURL = 'http://36.155.98.104:'; // 测试
} else if (import.meta.env.MODE === 'test') {
  gateWay = testGateWay;
  baseURL = ''; // 开发测试
} else if (import.meta.env.MODE === 'development_recovery') {
  gateWay = proGateWay;
  baseURL = 'http://221.181.100.64:'; // 灾备
} else {
  gateWay = proGateWay;
  baseURL = 'http://36.155.98.95:'; // 新正式
}

export default { gateWay, baseURL };
