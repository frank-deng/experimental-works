module.exports = {
  publicPath: './',
  outputDir: "dist",
  assetsDir: "assets",
  filenameHashing: false,
  lintOnSave: true,
  runtimeCompiler: false,
  productionSourceMap: false,
  devServer: {
    host: "0.0.0.0",
    port: 8081,
    https: false,
    open: false
  },
  configureWebpack:(config)=>{
    config.module.rules.unshift({
		  test:/\.worker\.js$/,
      use:[
        {
          loader:'worker-loader',
          options: {
            inline: true,
            fallback: false
          }
        }
      ]
    });
  }
};

