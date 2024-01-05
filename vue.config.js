const { resolve } = require('path');
const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const mockServer = require('@bwrong/mock');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const pkg = require('./package.json');
const { VUE_APP_API_HOST, VUE_APP_API_TITLE, VUE_APP_API_PREFIX } = process.env;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_MOCK = process.env.NODE_ENV === 'mock';
const productionGzipExtensions = ['js', 'css', 'html', 'svg'];
// 接口代理配置
const PROXY_CONFIG = {
  [VUE_APP_API_PREFIX]: {
    target: VUE_APP_API_HOST, // 你接口的域名
    // secure: false,
    // ws: true,
    changeOrigin: false, // 将Origin的来源更改为目标URL
    pathRewrite: {
      [`^${VUE_APP_API_PREFIX}`]: '/api' // 需要rewrite的,即真实的服务器地址中是否包含api_root
    }
  }
};
module.exports = defineConfig({
  publicPath: '/',
  assetsDir: 'static',
  indexPath: 'index.html',
  productionSourceMap: false,
  transpileDependencies: true, // 不需要兼容IE可以关闭此项，减少打包时间
  devServer: {
    open: false,
    // host: 'local-ip',
    port: 8081,
    setupMiddlewares(middlewares, devServer) {
      IS_MOCK &&
        mockServer(devServer.app, resolve('./mock/'), {
          prefix: VUE_APP_API_PREFIX,
          delay: 300
        });
      return middlewares;
    },
    proxy: IS_MOCK ? {} : PROXY_CONFIG
  },
  configureWebpack: (config) => {
    config.plugins.push(
      // 去掉moment多余语言文件
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
    );
    if (IS_PRODUCTION) {
      config.plugins.push(
        // gzip
        new CompressionWebpackPlugin({
          // 开启gzip压缩
          filename: '[file].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          compressionOptions: { level: 1 }
        })
      );
    }
  },

  chainWebpack: (config) => {
    // 添加文件路径别名
    config.resolve.alias.set('components', resolve('src/components'));
    // 优化js压缩
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      args[0].terserOptions.compress.drop_debugger = true;
      return args;
    });
    config.plugin('html').tap((args) => {
      // 修改title
      args[0].title = VUE_APP_API_TITLE;
      if (IS_PRODUCTION) {
        // 注入版本信息
        let appVersion = `app-version=${pkg.version},build-date=${new Date().toLocaleString()}`;
        try {
          const GitRevision = new GitRevisionPlugin();
          appVersion += `,
            git-hash=${GitRevision.version()},
            git-branch=${GitRevision.branch()}`;
        } catch (error) {
          console.warn('当前项目未设置有效git仓库,无法注入git相关信息!');
        }
        args[0].appVersion = appVersion;
      }
      return args;
    });
    // 分包
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'chunk-vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10, // 优先级
            chunks: 'initial'
          },
          antd: {
            name: 'chunk-antd',
            test: /[\\/]node_modules[\\/]_?(ant-design-vue|@ant-design)(.*)/,
            priority: 20
          },
          components: {
            name: 'chunk-components',
            test: resolve('src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk('single');
      // config.optimization.mergeDuplicateChunks=false;
    });
  },
  css: {
    sourceMap: !IS_PRODUCTION,
    loaderOptions: {
      less: {
        additionalData: '@import "@/assets/styles/_mixin.less";',
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            hack: `true;@import "${resolve('./src/assets/styles/_variable.less')}"`
          }
        }
      }
    }
  }
});
