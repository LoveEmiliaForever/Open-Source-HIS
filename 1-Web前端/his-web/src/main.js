import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueAxios from 'vue-axios'
import axios from 'axios'

const application = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  application.component(key, component)
}
application.use(store).use(router).use(ElementPlus, { locale: zhCn }).use(VueAxios, axios).mount('#app')
