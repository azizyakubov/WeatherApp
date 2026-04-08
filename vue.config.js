const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.OPENWEATHER_API_KEY": JSON.stringify(
          process.env.OPENWEATHER_API_KEY || ""
        ),
      }),
    ],
  },
});
