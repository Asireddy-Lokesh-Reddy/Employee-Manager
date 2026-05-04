const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/Employee-Manager/" : "/",
  transpileDependencies: true,
  parallel: false,
  lintOnSave: false,
  chainWebpack: (config) => {
    config.cache({
      type: "filesystem",
      cacheDirectory: path.resolve(__dirname, ".webpack-cache"),
    });

    config.module.rule("js").uses.delete("cache-loader");
    config.module.rule("vue").uses.delete("cache-loader");

    config.module
      .rule("js")
      .use("babel-loader")
      .tap((options) => ({
        ...options,
        cacheDirectory: path.resolve(__dirname, ".babel-cache"),
      }));
  },
});
