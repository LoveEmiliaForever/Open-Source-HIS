module.exports = {
  publicPath: './',
  chainWebpack: config => {
    // 获取vue-loader配置
    const vueLoader = config.module.rule('vue').use('vue-loader')
    // 修改vue-loader的配置
    vueLoader.tap(options => {
      // 关闭热重载
      options.hotReload = true
      return options
    })
  }
}
