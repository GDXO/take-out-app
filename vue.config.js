const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.devtool = false
    } else {
      config.devtool = 'cheap-module-source-map'
    }
  }
})
