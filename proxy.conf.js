const PROXY_CONFIG = {
  "/sap": {
    "target": "https://AZKTLDS5CP.kcloud.com:44300",
    "secure": false,           // Allow self-signed SAP SSL certs
    "changeOrigin": true,
    "logLevel": "debug",
    "headers": {
      // Remove 401 popup by stripping www-authenticate
    },
    "onProxyRes": function (proxyRes, req, res) {
      // SAP returns WWW-Authenticate header on 401 which triggers browser login popup.
      // We delete it so the Angular app can handle the error itself.
      if (proxyRes.headers['www-authenticate']) {
        delete proxyRes.headers['www-authenticate'];
      }
      // Allow CORS from localhost dev server
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    "onError": function(err, req, res) {
      console.error('[Proxy Error]', err);
    }
  }
};

module.exports = PROXY_CONFIG;
