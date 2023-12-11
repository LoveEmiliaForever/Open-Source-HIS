import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './mock'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import ganttastic from '@infectoone/vue-ganttastic'

// 测试用的PostmanMockServer
// axios.defaults.baseURL = 'https://52169e5c-d432-4578-bd2d-fdbd2bd71a63.mock.pstmn.io'

// 用于解决表格组件的大小调整出现为捕获错误
const debounce = (fn, delay) => {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor (callback) {
    callback = debounce(callback, 16)
    super(callback)
  }
}

const application = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  application.component(key, component)
}
application.use(store).use(router).use(ElementPlus, { locale: zhCn }).use(VueAxios, axios).use(ganttastic).mount('#app')
