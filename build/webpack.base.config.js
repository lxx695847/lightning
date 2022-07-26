const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const resolve = (url) => path.resolve(__dirname, url);
const isProd = process.env.NODE_ENV === 'production'
const { pageTitles } = require('./html-config')
let htmlPlugins = [];
const files = fs.readdirSync(path.resolve(__dirname, "../src/views")).filter(item => {
  return item !== 'pc' && item !== 'wap'
});
const description = {
  zh: 'Lightning Games是一家致力于为全世界玩家提供高质量主机和PC游戏的发行商。Lightning Games已经发行了《超载地牢》、《魔法洞窟2》、《烛火地牢2：猫咪的诅咒》、《硬核机甲》、《勇敢的哈克》等深受玩家喜爱的口碑佳作。',
  en: `Lighting games is a global PC& console video game publisher, has self-developer team. Lightning games has released video games such as 'Overdungeon', 'The Enchanted Cave 2'`
}
const keywords = {
  zh: `Lighting games，超载地牢，魔法洞窟2，硬核机甲 `,
  en: `Lighting games, Overdungeon, The Enchanted Cave 2`
}
const createHtmlPlugins = (lang) => {
  return files.map((item) => {
    let chunks = [item.split(".")[0]]
    const fileName = item.split(".")[0]
    return new HtmlWebpackPlugin({
      // title: pageTitles[fileName] ? pageTitles[fileName][lang] : '',
      filename: `${lang}/${item}`,
      template: `./src/views/${item}`,
      // favicon: './src/images/favicon.png',
      favicon: path.resolve('./src/images/favicon.ico'),
      // inject: 'head', // js插入的位置，true/'head'/'body'/false
      hash: true, // 为静态资源生成hash值
      chunks: chunks,
      // minify: false,
      meta: {
        'Keywords': keywords[lang],
        'Description': description[lang],
        'title': pageTitles[fileName] ? pageTitles[fileName][lang] : ''
      },
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true,                  //是否压缩html里的css（使用clean-css进行的压缩） 默认值false
        minifyJS: true,                   //是否压缩html里的js（使用uglify-js进行的压缩）
      }
    });
  });
}
htmlPlugins = [...createHtmlPlugins('zh'), ...createHtmlPlugins('en')]
module.exports = {
  entry: {
    index: "./src/js/index.js",
    games: "./src/js/games.js",
    game: "./src/js/game.js",
    news: "./src/js/news.js",
    newsDetail: "./src/js/newsDetail.js",
    about: "./src/js/about.js",
    policy: "./src/js/policy.js",
    404: "./src/js/404.js",
    vendor: ['vue', 'axios']
  },
  output: {
		filename: '[name].[hash].js',
		path: path.resolve(__dirname, 'dist')
	},
  plugins: [
    new webpack.ProvidePlugin({
      axios: "axios",
      vue: "vue",
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
    }),
    // 自动清空dist目录
    new CleanWebpackPlugin(),
    // 设置html模板生成路径
    ...htmlPlugins
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, `../src`),
      'vue': path.resolve(__dirname, `../src/plugins/vue@2.6.14.min.js`),
      'axios': path.resolve(__dirname, `../src/plugins/axios@0.24.0.min.js`),
      'swiper': path.resolve(__dirname, `../src/plugins/swiper-7.0.8/swiper-bundle.min.js`)
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|ejs$)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-transform-modules-commonjs"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // css中的图片路径增加前缀
              publicPath: "../",
            },
          },
          "css-loader",
        ],
          //use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // css中的图片路径增加前缀
              publicPath: "../",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/,
        include: [resolve('../src/images/svg')],
        use: [
          {

            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]'// 去掉svg这个图片加载不出来
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|webp)$/,
        exclude: [resolve('../src/images/svg')],
        use: [
          {
            loader: "file-loader",
            options: {
              // 图片输出的实际路径(相对于dist)
              outputPath: "images/",
              // 当小于某KB时转为base64
              limit: 0,
              name: "[name].[ext]",
              publicPath: "../../images",
              esModule: false, //解决方法
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        exclude: [resolve('../src/images/svg')],
        use: [
          {
            loader: "file-loader",
            options: {
              // 图片输出的实际路径(相对于dist)
              outputPath: "images/",
              // 当小于某KB时转为base64
              limit: 10000,
              publicPath: "../../images",
              name: "[name].[ext]",
              esModule: false, //解决方法
            },
          },
        ],
      },
      {
        test: /\.(html)$/i,
        use: [
          {
            loader: 'html-loader',
            options: {
              attributes: {
                list: [
                  {
                    tag: "img",
                    attribute: "src",
                    type: "src",
                  },
                  {
                    tag: "img",
                    attribute: "srcset",
                    type: "srcset",
                  },
                ]
              }
            }
          },
          {
            loader: 'include-template-loader',
            options: {
              sign: ['%%', '%%'],
              deep: 5
            }
          }
        ]
      }
    ]
  },
  // 编译输出配置
  output: {
    filename: "js/[name].[hash].js",
    // 输出路径为dist
    path: path.resolve(__dirname, "../dist")
  }
};
