import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home/Home.vue'
import Welcome from '../components/Home/Welcome.vue'
import Users from '../components/Home/Users/Users.vue'
import Roles from '../components/Home/Roles/Roles.vue'
import Rights from '../components/Home/Roles/Rights.vue'

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
    ]
  },
]

const router = new VueRouter({
  routes,
})

// 前置导航守卫：路由跳转之前做的检查及操作 控制页面访问权限
router.beforeEach((to,from,next) => {
  // to:去哪 from:从哪来 next：函数，表示放行

  // 如果用户从登录页来访问,直接进行下一步
  if(to.path=== '/login') return next();

  const tokenStr = window.sessionStorage.getItem('token');
  // 如果token不存在 让用户返回登录界面
  if(!tokenStr) return next('/login');

  next();
})

export default router
