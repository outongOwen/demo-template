const storeGenerator = require('./store-template/prompt');
const packageGenerator = require('./package-template/prompt');
module.exports = plop => {
  plop.setGenerator('store', storeGenerator);
  plop.setGenerator('package', packageGenerator);
};
