import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'


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

// 全局定义一个过滤器
Vue.filter('dateformat',function(originVal){
const dt = new Date(originVal)

// padStart()是es2017字符串补全长度的功能
const y = dt.getFullYear();
const m = (dt.getMonth() + 1 + '').padStart(2, '0');
const d = (dt.getDate() + '').padStart(2, '0');
const hh = (dt.getHours() + '').padStart(2, '0')
const mm = (dt.getMinutes() + '').padStart(2, '0')
const ss = (dt.getSeconds() + '').padStart(2, '0')

// 拼接成一个完整的字符串
return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

// 注册富文本编辑器为全局可用组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
