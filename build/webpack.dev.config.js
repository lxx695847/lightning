const { merge } = require("webpack-merge");
const base = require("./webpack.base.config");
const webpack = require("webpack");
const readEnv = require('./readEnv')
const env = readEnv('../.env.development')
const processEnv = {
  NODE_ENV: "'development'"
}
Object.keys(env).map(key => {
  processEnv[key] = `'${env[key]}'`
})
console.log(env.VUE_APP_BASE_API);
module.exports = merge(base, {
  mode: "development",
  plugins: [
    new webpack.DefinePlugin({ // 定义环境和变量
      'process.env': processEnv
    })
  ],
  // 使用webpack-dev-server，提高开发效率
  devServer: {
    host: '0.0.0.0',
    contentBase: './',
    port: 9089,
    inline: true,
    hot: true,
    open: true,
    proxy: {
      [`${env.VUE_APP_BASE_API}/game-api`]: {
        target: 'http://lightning.games',// 代理地址 把获取的地址更换成。。。
        changeOrigin: false,     // 域名跨域
        secure: false,          // https跨域
        changeOrigin: true,
        pathRewrite: {
          [`${env.VUE_APP_BASE_API}/game-api`]: ''
        }
      },
      [env.VUE_APP_BASE_API]: {
        target: env.VUE_APP_BASE_URL,// 代理地址 把获取的地址更换成。。。
        changeOrigin: false,     // 域名跨域
        secure: false,          // https跨域
        changeOrigin: true,
        pathRewrite: {
          ['^' + env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
});
