const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  // entry: "../index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "react-swiper.bundle.js"
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
              modules: true
            }
          },
          // Compiles Sass to CSS
          "sass-loader"
        ]
      }
    ]
  }
};
