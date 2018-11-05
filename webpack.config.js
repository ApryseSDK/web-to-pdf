const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const { IgnorePlugin } = require('webpack');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  target: 'node',
  mode: "production",
  node: {
    __dirname: false,
  },
  entry: ['./src/index.js'],
  devtool: 'source-map',
  externals: ['aws-sdk', 'puppeteer', 'node-sass', 'live-server'],
  output: {
    filename: 'web-to-pdf.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'webToPdf',
    libraryTarget: 'umd'
  },
  plugins: [
    new IgnorePlugin(/vertx/),
    new IgnorePlugin(/bufferutil/),    
    new IgnorePlugin(/utf-8-validate/),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true, entryOnly: true, include: 'web-to-pdf.js' }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "index.css"
    }),
    
    
  ],
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ],
    // Disable handling of requires with a single expression
    exprContextRegExp: /$^/,
    exprContextCritical: false,
    // Disable handling of requires with expression wrapped by string,
    wrappedContextRegExp: /$^/,
    wrappedContextCritical: false,
  }
};