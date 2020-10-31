import { merge } from 'webpack-merge';
import { join } from "path";
import { Configuration as WebpackConfig } from "webpack";
import {
  HotModuleReplacementPlugin,
} from "webpack";
import { Configuration as DevServerConfig } from "webpack-dev-server";
import common, { rootDir } from './webpack.common';

const config = (env: any, args: WebpackConfig): WebpackConfig => {
  return merge(common, {
    mode: 'development',
    devServer: ((): DevServerConfig => {
      return {
        contentBase: join(rootDir, "/dist"),
        hot: true,
        inline: true,
      };
    })(),
    devtool: "inline-source-map",
    output: {
      filename: '[name].bundle.js',
    },
    plugins: [
      new HotModuleReplacementPlugin(),
    ]
  });
}

export default config;
