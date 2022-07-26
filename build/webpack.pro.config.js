const path = require("path");
const { merge } = require("webpack-merge");
const base = require("./webpack.base.config");
const webpack = require("webpack");
const isAnalyzer = process.env.NODE_ENV === "analyzer";
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
var UglifyJsPlugin=require('uglifyjs-webpack-plugin');
const readEnv = require('./readEnv')
const env = readEnv('../.env.production')
const processEnv = {
  NODE_ENV: "'production'"
}
Object.keys(env).map(key => {
  processEnv[key] = `'${env[key]}'`
})
module.exports = merge(base, {
  mode: "production",
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendor",
          minChunks: 2,
          priority: -20,
          chunks: 'all',
          reuseExistingChunk: true
        },
        commom: {
          name: "chunks-commom",
          minChunks: 2,
          priority: -20,
          chunks: 'all',
          reuseExistingChunk: true
        }
      },
    },
    //压缩js
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        }
      })
    ]
  },
  plugins: isAnalyzer
    ? [
        new BundleAnalyzerPlugin({
            analyzerPort: 8889,
        })
      ]
    : [
      new webpack.DefinePlugin({ // 定义环境和变量
        'process.env': processEnv
      })
    ]
});
