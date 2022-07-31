import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

import './plugins/element.js'

// 导入入口文件
import './assets/css/global.css'
// 导入字体图标
import './assets/css/fonts/iconfont.css'

// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/';

// 文档标明：需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌，所以进行拦截
axios.interceptors.request.use(config => {
  // console.log(config);
  // 在登陆的时候第一次发送axios 那时候拦截器已经执行过了 后面才给token赋值 所以第一次没有
  config.headers.Authorization = window.sessionStorage.getItem('token');

  return config;
})
Vue.prototype.$http = axios;

// 注册全局组件
Vue.component("tree-table",TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
