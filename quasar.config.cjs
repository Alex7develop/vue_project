module.exports = function (ctx) {
  return {
    devServer: {
      server: {
        type: 'http'
      },
      port: 8080,
      open: true,
      proxy: {
        '/api': {
          target: 'http://tstai.rasar.keenetic.link',
          changeOrigin: true,
          secure: false,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Proxy Request:', {
                method: req.method,
                url: req.url,
                target: options.target + req.url
              });
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Proxy Response:', {
                status: proxyRes.statusCode,
                headers: proxyRes.headers
              });
            });
          }
        }
      }
    },
    vitePlugins: [
      ['@vitejs/plugin-vue', {
        reactivityTransform: true
      }]
    ],
    alias: {
      '@': path.join(__dirname, './src')
    }
  }
} 