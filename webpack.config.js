const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  const isProduction = env.NODE_ENV === "development";
  console.log("envvvvv", env.NODE_ENV);
  const envFile = isProduction ? ".env" : ".env";
  const envPath = path.resolve(__dirname, envFile);
  const envVars = require("dotenv").config({ path: envPath }).parsed || {};
  return {
    entry: "./src/index.js",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.js$|jsx/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: "./src/index.html",
        //   favicon: "./src/assets/LogoIcon.svg",
      }),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(envVars),
      }),
    ],
    devServer: {
      hot: true,
      port: 3000,
      open: true,
      historyApiFallback: true,
    },
    resolve: {
      extensions: [".js", ".jsx"],
    },
  };
};
