/**
 * Base webpack config used across other specific configs
 */

import webpack from 'webpack';
import webpackPaths from './webpack.paths';
import { dependencies as externals } from '../../release/app/package.json';

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // Remove this line to enable type checking in webpack builds
            transpileOnly: true,
          },
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    // fallback: {
    //   url: false,
    //   assert: false,
    //   util: false,
    //   fs: false,
    //   child_process: false,
    //   querystring: false,
    //   "querystring-es3": false,
    //   os: false,
    //   https: false,
    //   path: false,
    //   zlib: false,
    //   http: false,
    //   stream: false,
    //   // url: require.resolve("url/"),
    //   // assert: require.resolve("assert/"),
    //   // util: require.resolve("util/"),
    //   // os: require.resolve("os-browserify/browser"),
    //   // https: require.resolve("https-browserify"),
    //   // path: require.resolve("path-browserify"),
    //   // zlib: require.resolve("browserify-zlib"),
    //   // http: require.resolve("stream-http"),
    //   // stream: require.resolve("stream-browserify"),
    // }
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
