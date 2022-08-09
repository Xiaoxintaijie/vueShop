<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header >
            <div>
                <img src="../../assets/img/maomao.png" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside 
                      width="isCollapse ? '64px' : '200px'"  >
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- active-text-color:激活文本颜色 -->
                <!-- unique-opened: 设置打开一级菜单的时候每次只展开一项 -->
                <!-- collapse:默认菜单不折叠，可以选择让它折叠 -->
                <!-- router:是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
                <!-- default-active：当前激活菜单的 index -->
                <el-menu background-color="#f7e8aa" 
                         text-color="#619ac3" 
                         active-text-color="#f17666" 
                         :unique-opened="true" 
                         :collapse="isCollapse" 
                         :collapse-transition = "false" 
                         :router = "true" 
                         :default-active = "activePath">
                    <!-- 一级菜单 -->
                    <!-- index不同，点击的时候就触发当前按钮，不然全都相同那么一点击全都触发了 -->
                    <el-submenu :index="item.id+' '"  
                                v-for="item in menulist" 
                                :key="item.id">
                        <!-- 一级菜单模板区 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span class="user-defined">{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subitem.path" 
                                      v-for="subitem in item.children" 
                                      :key="subitem.id" 
                                      @click="saveNavState('/' +subitem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subitem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧主题内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
// import Welcome from './Welcome.vue';

export default {
    name:'Home',
    // components:{
    //     Welcome,
    // },
    data(){
        return{
          menulist:[],  //存放菜单数组
          iconsObj:{
            // 因为数据很少，所以写死
            // key的值可以选取item.id，也可以选v-for遍历的index
            '125': 'iconfont icon-users',
            '103': 'iconfont icon-tijikongjian',
            '101': 'iconfont icon-shangpin',
            '102': 'iconfont icon-danju',
            '145': 'iconfont icon-baobiao',
            // '0': 'iconfont icon-users',
            // '1': 'iconfont icon-tijikongjian',
            // '2': 'iconfont icon-shangpin',
            // '3': 'iconfont icon-danju',
            // '4': 'iconfont icon-baobiao',
          },  //存放自定义图标
          isCollapse:true,  //默认折叠
          activePath:' ',    //保存被激活的链接地址
        }
    },
    created(){
        // 获取菜单权限
        this.getMenuList();

        // 点击菜单对应链接高亮，
        // 将sessionStorage保存的路径动态赋值给高亮属性
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods:{
        logout (){
            // 清空token
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
       async getMenuList(){
            // 获取所有请求
            const { data : res} = await this.$http.get('menus');
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.menulist = res.data;
            // console.log(this.menulist);
        },
        toggleCollapse(){
            // 切换菜单的折叠
            this.isCollapse = !this.isCollapse;
        },
        saveNavState(activePath){
            // 保存被点击的路由地址
            // 如果不用sessionStorage,点击页面再跳转回来不会记录之前点击的页面
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath = activePath;
            // console.log(this.activePath);
        },
    },

}
</script>

<style lang="less" scoped>
.home_container{
    height:100%;
}
.el-header{
    background-color: #525288;
    display:flex;
    justify-content: space-between;
    padding-left:0px;
    // align-items元素在辅轴上如何对齐
    align-items: center;
    color: #619ac3;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
}
.el-aside{
    background-color: #f7e8aa;
    .el-menu {
        // 解决菜单和侧边栏右侧对不齐的原因：清除原本附带的样式
        border-right: 0px;
    }

}
.el-main{
    background-color: #efafad;
}

// 让一级菜单的图标和文本拉开距离
.iconfont{
    margin-right: 10px;
}

// 父子元素关系选择器 不生效
// el-submenu > template > span{
//     margin-left: 10px;
// }

// 属性选择器 可以用，要给span加对应类
// span[class='user-defined']{
//     margin-left: 10px;
// }

.toggle-button{
    background-color: #f17666;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;//字符间距
    // 设定网页浏览时用户鼠标指针的样式：小手
    cursor: pointer;
}

</style>