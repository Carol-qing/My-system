const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',//后端接口的根目录
      changeOrigin: true,//是否跨域,
      pathRewrite: {
        "^/api": ""
    }
    })
  );
};