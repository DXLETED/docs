const NodemonPlugin = require('nodemon-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
  entry: {
    main: './client/app.js'
  },
  mode: 'development',
  output: {
    filename: `js/[name].js`,
    path: path.resolve(__dirname, 'dist/')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader' },
        resolve: {
          fullySpecified: false
        }
      },
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      {
        test: /\.sass$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { modules: { localIdentName: '[local]_[hash:base64:5]' } } },
          'sass-loader'
        ]
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: { loader: 'url-loader' } }
    ]
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  plugins: [
    new NodemonPlugin({
      script: './server/app.js',
      watch: './server',
      nodeArgs: '--experimental-specifier-resolution=node'
    }),
    new MiniCssExtractPlugin({ filename: 'css/[name].css' })
  ],
  devtool: 'source-map',
  watch: true
}