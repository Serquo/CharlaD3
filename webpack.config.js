const path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  WebpackMd5Hash = require('webpack-md5-hash'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  CONFIG = require('./config.js');

module.exports = (env) => {
  let configEnvironment;
  if (env.dev) {
    configEnvironment = CONFIG['dev'];
  } else if (env.test) {
    configEnvironment = CONFIG['test'];
  } else if (env.prod) {
    configEnvironment = CONFIG['prod'];
  }
  return {
    entry: {
      main: './src/app.js',
    },
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      //contentBase: path.join(__dirname, 'src'),
      contentBase: './dist',
      //compress: true,
      port: 8080,
      //publicPath: '/dist/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.join(__dirname, 'src'),
          loader: 'babel-loader',
          exclude: /node_modules/,
          //exclude: /node_modules/,
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: 'eslint-loader',
            options: {
              emitWarning: true,
              rules: {semi: 0},
            },
          }],
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.less$/,
          loader: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader',
          ],
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:7].[ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:7].[ext]',
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin('dist', {}),
      new MiniCssExtractPlugin({
        filename: 'style.[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        //inject: false,
        hash: true,
        template: './src/index.html',
        filename: 'index.html',
      }),
      new WebpackMd5Hash(),
      new webpack.DefinePlugin({
        'process.env.prisma_testing': JSON.stringify(configEnvironment.testing),
        'process.env.prisma_endpoint': JSON.stringify(configEnvironment.endpoint),
      }),
    ],
    resolve: {
      alias: {
        indexPath: path.resolve(__dirname, './src/index'),
        images: path.resolve(__dirname, './src/resources/img'),
        scripts: path.resolve(__dirname, './src/resources/js'),
        fonts: path.resolve(__dirname, './src/resources/fonts'),
        component: path.resolve(__dirname, './src/components'),
        helpers: path.resolve(__dirname, './src/helpers'),
        filters: path.resolve(__dirname, './src/filters'),
        services: path.resolve(__dirname, './src/services'),
      },
    },
    performance: {
      hints: false,
    },
  };
};
