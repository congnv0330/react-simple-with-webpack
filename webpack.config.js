const path = require('path')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const Dotenv = require('dotenv-webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const WebpackBar = require('webpackbar')

// Disable React DevTools in production
const disableReactDevtools = '<script>if(typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__==="object"){__REACT_DEVTOOLS_GLOBAL_HOOK__.inject=function(){};}</script>'

const appSrc = './src'

module.exports = (env, options) => {
  const isProductionMode = options.mode === 'production'
  const isDevelopmentMode = !isProductionMode

  const webpackConfig = {
    devtool: isProductionMode ? false : 'eval-source-map',
    target: ['browserslist'],
    entry: appSrc + '/index.jsx',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: isProductionMode
        ? 'js/[contenthash:8].js'
        : 'js/[name].js',
      chunkFilename: isProductionMode
        ? 'js/[contenthash:8].chunk.js'
        : 'js/[name].chunk.js',
      assetModuleFilename: 'media/[hash][ext]',
      publicPath: '/',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                isDevelopmentMode && require.resolve('react-refresh/babel')
              ].filter(Boolean)
            }
          }
        },
        {
          test: /\.(scss|css)$/,
          use: [
            isDevelopmentMode && require.resolve('style-loader'),
            isProductionMode && MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                sourceMap: isDevelopmentMode
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                sourceMap: isDevelopmentMode
              }
            }
          ].filter(Boolean)
        }
      ]
    },
    resolve: {
      // Resolve in this order
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.md'],
      alias: {
        '@': path.resolve(__dirname, appSrc)
      }
    },
    plugins: [
      new Dotenv(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './public'),
            globOptions: {
              dot : true,
              gitignore: true,
              ignore: ['*.DS_Store']
            }
          }
        ]
      }),
      isDevelopmentMode && new CaseSensitivePathsPlugin(),
      isDevelopmentMode && new ReactRefreshWebpackPlugin({
        overlay: false
      }),
      isProductionMode && new MiniCssExtractPlugin({
        filename: 'css/[contenthash:8].css',
        chunkFilename: 'css/[contenthash:8].chunk.css',
        ignoreOrder: false
      }),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            template: './index.html'
          },
          isProductionMode
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true
                },
                disableReactDevtools
              }
            : {}
        )
      ),
      // isProductionMode && new BundleAnalyzerPlugin({
      //   analyzerMode: 'static'
      // }),
      new ESLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        eslintPath: require.resolve('eslint'),
        context: appSrc
      }),
      new WebpackBar()
    ].filter(Boolean),
    optimization: {
      minimize: isProductionMode,
      minimizer: [new CssMinimizerPlugin(), '...'],
      runtimeChunk: 'multiple'
    },
    stats: {
      chunks: true,
      assets: false,
      modules: false
    }
  }

  if (isProductionMode) {
    webpackConfig.performance ={
      hints: false,
      maxEntrypointSize: 5242880,
      maxAssetSize: 5242880,
    }
  } else {
    webpackConfig.devServer = {
      historyApiFallback: true,
      open: true,
      compress: true,
      port: 9091
    }
  }

  return webpackConfig
}
