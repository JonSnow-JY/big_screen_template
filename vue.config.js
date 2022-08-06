const { defineConfig } = require("@vue/cli-service");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// 拼接路径
const resolve = (dir) => require("path").join(__dirname, dir);

let publicPath = "";

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath,
  lintOnSave: false,
  outputDir: process.env.VUE_BASE_DIR,
  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API,
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
  configureWebpack: () => {
    const configNew = {};
    if (process.env.NODE_ENV === "production") {
      configNew.externals = {
        T: "T", // 天地图
      };
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        }),
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true, // 清除 console 语句
              drop_debugger: false, // 清除 debugger 语句
              pure_funcs: ["console.log"], // 移除console
            },
          },
        }),
      ];
    }
    return configNew;
  },
  chainWebpack: (config) => {
    //忽略/moment/locale下的所有文件
    config.optimization.runtimeChunk({
      name: "manifest",
    });
    config.optimization.splitChunks({
      cacheGroups: {
        // External dependencies common to all pages
        libs: {
          name: "chunk-vendor",
          chunks: "initial",
          minChunks: 1,
          test: /[\\/]node_modules[\\/]/,
          priority: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
        // Code common to all pages
        common: {
          name: "chunk-common",
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
        // Vue family packages
        vue: {
          name: "chunk-vue",
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
          chunks: "all",
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
        // only element-ui
        element: {
          name: "chunk-element",
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          chunks: "all",
          priority: 3,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    });
    config.plugins.delete("prefetch").delete("preload");
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve.symlinks(true);

    // 重新设置 alias
    config.resolve.alias
      .set("api", resolve("src/api"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("mixins", resolve("src/mixins"))
      .set("views", resolve("src/views"))
      .set("store", resolve("src/store"))
      .set("plugin", resolve("src/plugin"))
      .set("util", resolve("src/util"))
      .set("libs", resolve("src/libs"))
      .set("router", resolve("src/router"));
  },
  // 不输出 map 文件
  productionSourceMap: false,
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [resolve("src/assets/sass/var.scss")],
    },
  },
});
