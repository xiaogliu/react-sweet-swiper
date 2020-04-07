const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  // entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "react-swiper.bundle.js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // extract css to separate file (replace style-loader)
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              // use css modules
              modules: true,
            },
          },
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [
          // extract css to separate file (replace style-loader)
          //
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              // importLoaders: 1,
              // modules: true,
              // localIdentName: "[name]_[local]_[hash:base64:5]",
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  //set plugins
  plugins: [new MiniCssExtractPlugin()],
};
