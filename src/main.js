import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'
// 引入字体图标
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios请求拦截
// 在ajax请求头中添加token字段
axios.interceptors.request.use((config) => {
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})

Vue.prototype.$http = axios;

// 关闭生产提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
