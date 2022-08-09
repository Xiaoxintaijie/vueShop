import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Login from '../components/Login.vue'
import Home from '../components/Home/Home.vue'
import Welcome from '../components/Home/Welcome.vue'
import Users from '../components/Home/Users/Users.vue'
import Roles from '../components/Home/Roles/Roles.vue'
import Rights from '../components/Home/Roles/Rights.vue'
import Categories from '../components/Home/Goods/Categories.vue'
import Params from '../components/Home/Goods/Params.vue'
import Goods from '../components/Home/Goods/Goods.vue'
import Add from '../components/Home/Goods/Add.vue'
import Orders from '../components/Home/Orders/Orders.vue'
import Reports from '../components/Home/Reports/Reports.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        // 带斜杠用/welcome访问，不带斜杠用/home/welcome访问
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/roles',
        component: Roles,
      },
      {
        path: '/rights',
        component:Rights,
      },
      {
        path: '/categories',
        component:Categories,
      },
      {
        path: '/params',
        component:Params,
      },
      {
        path: '/goods',
        component:Goods,
      },
      {
        path: '/add',
        component: Add,
      },
      {
        path: '/orders',
        component: Orders,
      },
      {
        path: '/reports',
        component: Reports,
      },
      
      
    ]
  },
]

const router = new VueRouter({
  routes,
})

// 配置一下进度条,不配置会报错的
// inc()随机增长进度条，注意，这个方法永远不会让进度条达到100%。
//showSpinner: 隐藏环形进度条
// 颜色默认蓝色
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

// 前置导航守卫：路由跳转之前做的检查及操作 控制页面访问权限
router.beforeEach(async(to,from,next) => {
  // to:去哪 from:从哪来 next：函数，表示放行
  
  //  引入进度条
  NProgress.start()

  // 如果用户从登录页来访问,直接进行下一步
  if(to.path=== '/login') return next();

  const tokenStr = window.sessionStorage.getItem('token');
  // 如果token不存在 让用户返回登录界面
  if(!tokenStr) return next('/login');

  next();
})

// 全局后置路由守卫: 初始化时执行，每次路由切换后执行
// 后置守卫没有 next 因为它已经是在路由跳转后了没必要进行路由跳转的放行了
router.afterEach(() => {
  NProgress.done()
})


export default router
