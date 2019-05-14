'use strict';

module.exports = appInfo => {
  const config = {
    keys: `${appInfo.name}_1489132676072_319`,
    security: {
      domainWhiteList: [ '*' ], // 允许跨域的端口
      csrf: {
        enable: false,
        ignoreJSON: true,
        queryName: '_csrf', // 通过 query 传递 CSRF token 的默认字段为 _csrf
        bodyName: '_csrf', // 通过 body 传递 CSRF token 的默认字段为 _csrf
      },
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    multipart: {
      mode: 'file',
      fileSize: '1000mb', // 修改限制传输文件大小 （默认10mb）
      fileExtensions: [ '.xmind' ],
    },
  };
  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '0.0.0.0',
    },
  };
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1549935772902_5992';
  config.middleware = [];

  return config;
};
