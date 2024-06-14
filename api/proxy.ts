const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req: any, res: any) => {
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;

  const proxy = createProxyMiddleware({
    target: API_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api', // optional: if your backend API path does not have '/api' prefix
    },
  });

  return proxy(req, res, (err) => {
    if (err) {
      res.status(500).send('Proxy error');
    }
  });
};
