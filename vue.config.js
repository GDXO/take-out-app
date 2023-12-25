const { defineConfig } = require('@vue/cli-service')

// mock 数据
const appData = require('./data.json')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.devtool = false
    } else {
      config.devtool = 'cheap-module-source-map'
    }
  },
  devServer: {
    setupMiddlewares (middlewares, devServer) {
      // 返回 seller 数据
      devServer.app.get('/api/sellers', (req, res) => {
        res.json({
          errNo: 0,
          data: seller
        })
      })

      // 返回 goods 数据
      devServer.app.get('/api/goods', (req, res) => {
        res.json({
          errNo: 0,
          data: goods
        })
      })

      // 返回 ratings 数据
      devServer.app.get('/api/ratings', (req, res) => {
        res.json({
          errNo: 0,
          data: ratings
        })
      })

      return middlewares
    }
  }
})
