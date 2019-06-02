const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    host: 'localhost',
    port: 8085, // CHANGE YOUR PORT HERE!
    https: false,
    hotOnly: false
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/_variables.scss";`
      }
    }
  }
}