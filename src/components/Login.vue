<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <!-- 头像区 -->
                <img src="../assets/img/logo.png" alt="图标"/>
            </div>

            <!-- 登录表单区 -->
                <el-form  label-width="0px" 
                          class="login_form" 
                          ref="loginFormRef"
                          :model="loginForm" 
                          :rules="loginFormRules">
                   <el-form-item prop="username">
                       <!-- 用户名 -->
                       <el-input prefix-icon="iconfont icon-user" 
                                 v-model="loginForm.username" >
                       </el-input>
                    </el-form-item>
                    <el-form-item  prop="password">
                        <!-- 密码 -->
                        <el-input prefix-icon="iconfont icon-3702mima" 
                                  suffix-icon="iconfont icon-showpassword"
                                  type="password" 
                                  v-model="loginForm.password">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="btns">
                        <!-- 按钮区域 -->
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data(){
        return {
          loginForm: {
            username: 'admin',
            password: '123456'
          }, //登录表单数据绑定对象
          loginFormRules:{
            username:[
                { required: true, message: '请输入登录名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            password:[
                { required: true, message: '请输入登录密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ]
          },//表单验证规则对象
        }
    },
    methods:{
        resetLoginForm (){
            this.$refs.loginFormRef.resetFields();
        },
        login (){
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid) return;
                // 解构赋值改名语法 对象是根据属性名赋值的
                const { data:res } = await this.$http.post('login',this.loginForm);
                // console.log(res);
                // console.log(this);
                if(res.meta.status !== 200) return this.$message.error('登陆失败');
                this.$message.success('登录成功');
                // 设置token,保存token到sessionStorage中
                window.sessionStorage.setItem('token',res.data.token);
                // 页面跳转到后台主页
                this.$router.push('/home');
            });
        },

    }
    
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
// 占满全屏
    height:100%;
}
.login_box{
   width: 450px;
   height: 300px;
   background-color: #fff; 
   border-radius: 3px;
//    位置调整到中央
   position:absolute;
   left:50%;
   top:50%;
   transform: translate(-50%,-50%);

// 语法嵌套
   .avatar_box{
    // 设置头像样式
       height: 130px;
       width:130px;
       border: 1px,solid,#eee;
       border-radius:50%;
       padding:10px;
       box-shadow:0 0 10px #ddd;
       img{
        // 撑满父盒子
        width:100%;
        height:100%;
        border-radius:50%;
        background-color: #eee;
       }
        // 使居中
       position:absolute;
       left:50%;
       transform: translate(-50%,-50%);
  }
}

.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

</style>