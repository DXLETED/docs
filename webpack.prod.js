import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  entry: {
    main: './client/app.js'
  },
  mode: 'production',
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
  plugins: [new MiniCssExtractPlugin({ filename: 'css/[name].css' })]
}