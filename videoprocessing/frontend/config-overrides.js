const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('antd', {
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
      modifyVars: {'@border-radius-base': '10px'},
      javascriptEnabled: true,
  }),
);
