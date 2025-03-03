const path = require('path');

const root = __dirname;
const PORT = 8080;
const ajaxBaseURL = `http://localhost:3000`;

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
  restapi: ajaxBaseURL,
};

module.exports = config;
