import path from 'path';
import { merge } from 'webpack-merge';
import CompressionWebpackPlugin from "compression-webpack-plugin";
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import { Configuration as WebpackConfig } from "webpack";
import common, { rootDir } from './webpack.common';


const config = (env: any, args: WebpackConfig): WebpackConfig => {
  return merge(common, {
    mode: 'production',
    output: {
      filename: '[name].[contentHash].bundle.js',
      path: path.resolve(__dirname, '..', 'dist'),
    },
    devtool: 'source-map',
    optimization: {
      moduleIds: 'hashed',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new FaviconsWebpackPlugin(path.resolve(rootDir, 'public/logo.png')),
      new CompressionWebpackPlugin({
        algorithm: "gzip",
        minRatio: 0.8,
        test: /\.(js|html|css)$/,
        threshold: 10240, // Customize this to the amount you think is big enough to enable compression (in bytes)
      }),
    ],
  });
}

export default config;
