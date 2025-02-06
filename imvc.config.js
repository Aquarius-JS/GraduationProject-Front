const path = require('path');

const root = __dirname;
const PORT = 8080;

const config = {
  title: '校园车辆管理平台',
  description: '毕业设计',
  favicon: 'assert/1.jpg',
  // root: `${__dirname}/`,
  port: PORT,
  routes: 'routes',
  layout: 'layout',
  // "staticEntry": "index.html",
  // "publish": "./publish",
  // "output": {
  //     "path": "./publish/static"
  // }
  hot: true,
};

module.exports = config;
