<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">

        <!-- clearable属性: 即得到一个可清空的输入框 -->
        <!-- clear: 在点击由 clearable 属性生成的清空按钮时触发 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" 
          v-model="queryInfo.query" 
          clearable 
          @clear=getUserList()>
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>

      </el-row>

      <!-- 用户列表展示区域 -->
      <!-- border: 表格虚线 -->
      <!-- stripe：带斑马纹的表格 -->
      <!-- type = "index" 索引列 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽，接收scope，scope.row代表这一行对应的数据 -->
          <template slot-scope="scope">
            <!-- {{scope.row.mg_state}} -->
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
              @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 获取用户ID进行操作 -->
          <template slot-scope="scope">
            <!-- {{scope.row.id}} -->
            <!-- 修改 -->
            <el-button type="primary" 
            icon="el-icon-edit" 
            size="mini" 
            @click="showEditDialog(scope.row.id)">
            </el-button>
            <!-- 删除 -->
            <el-button type="danger" 
            icon="el-icon-delete" 
            size="mini" 
            @click="removeUserById(scope.row.id)">
            </el-button>
            <!-- 分配权限 -->
            <!-- el-tooltip：鼠标放上面显示提示信息 -->
            <!-- enterable: 鼠标是否可进入到 tooltip 中 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页区 -->
      <!-- size-change： 多少条/每页 -->
      <!-- current-change:监听页码值发生改变 -->
      <!-- layout: 页面展示的各种数据 -->
      <el-pagination @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" 
        :page-sizes="[1, 2, 5, 10]" 
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" 
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" 
               :visible.sync="addDialogVisible" 
               width="50%" 
               @close="addDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="addForm" 
               :rules="addFormRules" 
               ref="addFormRef" 
               label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 1，请求数据 1，修改数据-->
    <!-- @close功能，重置表单验证。。。。。。 -->
    <!-- disabled: 用户名禁止编辑属性 -->
    <el-dialog title="修改用户" 
               :visible.sync="editDialogVisible" 
               width="50%" 
               @close="editDialogClosed" >
      <el-form :model="editForm" 
               :rules="addFormRules" 
               ref="editFormRef" 
               label-width="70px">
        <el-form-item label="用户名" >
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
         <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: 'users',
  data(){
    var checkEmail = (rule,value,cb) => {
      // 验证邮箱
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    var checkMobile = (rule,value,cb) => {
      // 验证手机号
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryInfo:{
        query: '',   //搜索关键字
        pagenum: 1,   //当前页数
        pagesize: 2,  //当前每页显示多少条数据
      },//获取用户列表的参数对象
      userList:[],//保存用户列表信息
      total: 0,//总数据条数

      addDialogVisible:false,//控制添加对话框的显示与隐藏
      editDialogVisible:false,//控制修改对话框的显示与隐藏

      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },//保存添加用户的表单数据
      editForm:{
        id:'',
        username:'',
        email:'',
        mobile:'',
      },//保存修改用户的表单数据

      addFormRules:{
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur'}
        ],
      },//添加表单验证规则对象
      editFormRules:{
      },//修改表单验证规则对象
    }
  },
  created(){
    this.getUserList();

  },
  methods:{
    async getUserList(){
      const { data : res } = await this.$http.get('users', {
        params: this.queryInfo
      });
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('用户列表获取失败');
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(this.userList);
      // console.log(this.total);
    },
    handleSizeChange(newSize){
      // 监听每页展示多少条
      // console.log("newSize:"+newSize);
      this.queryInfo.pagesize = newSize;
      // 每页展示条数发生变化，那就重新请求数据
      this.getUserList();
    },
    handleCurrentChange(newPage){
      // 监听展示到第几页
    //  console.log("newPage:"+newPage);
    //  查看下一页，就要改变请求的页数，重新请求数据
     this.queryInfo.pagenum = newPage;
    //  console.log("pagenum:"+this.queryInfo.pagenum);
     this.getUserList();
    },
    async userStateChanged(userInfo){
      // 监听switch状态改变 申请在数据库里改变
      // console.log(userInfo.mg_state);
      const { data : res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`);
      // console.log(res);
      if(res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return  this.$message.error('更新用户状态失败!');
      }
      this.$message.success('更新用户状态成功');
    },
    addDialogClosed(){
      // 监听添加用户对话框的关闭事件
      // resetFields:表单重置方法 重置表单验证
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    addUser(){
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 预校验成功，则可以添加真正的用户请求
        const { data:res } = await this.$http.post('users', this.addForm);
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error('添加用户信息失败');
        this.$message.success('添加用户信息成功');
        // 添加用户成功，关闭对话框
        this.addDialogVisible = false;
        // 重新刷新列表
        this.getUserList();
      })
    },
    async showEditDialog(id){
      // 展示用户编辑的对话框
      // 获取到被选中用户的ID信息 -> 用get请求获取并保存用户数据 -> 展示在对话框 
      this.editDialogVisible = true;
      // console.log(id);
      const { data : res } = await this.$http.get('users/' + id);
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败');
      // console.log(res);
      this.editForm = res.data;
      // console.log(this.editForm);
    },
    editUser(){
     this.$refs.editFormRef.validate(async valid => {
      if(!valid) return this.$message.error('修改用户信息失败');

      const { data : res } = await this.$http.put("users/"+this.editForm.id,{
        email: this.editForm.email,
        mobile: this.editForm.mobile,
      });
      if (res.meta.status !== 200) return this.$message.error('修改用户信息失败');
      this.$message.success('修改用户信息成功');
      console.log(res);

      // 添加用户成功，关闭对话框
      this.editDialogVisible = false;
      // 重新刷新列表
      this.getUserList();
     })

    },
    async  removeUserById(id){
      // 根据ID删除对应的用户信息
      // 首先确认是否删除
        const confirmResult = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?', '提示', 
          {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
          }).catch(err => err);
          //confirmResult的值是字符串，取决于用户点击的是取消还是确定
          // 点击取消 ->confirmResult值为“cancel”
          // 点击确定 ->confirmResult值为“confirm”

        // console.log(id);

        if(confirmResult !== 'confirm'){
          return this.$message.info("已取消删除");
        }

        const { data:res } = await this.$http.delete('users/'+id)
        if (res.meta.status !== 200) return this.$message.error('删除用户信息失败');
        this.$message.success('删除用户信息成功');
        
        console.log(res);
        console.log(this.userList);

         // 添加用户成功，关闭对话框
        this.editDialogVisible = false;

        // 一页一条数据的情况：判断当前展示的用户数据是否只有一条
        if(this.userList.length === 1){
          //若是，则继续判断页码是否已经在第一页，若是则保持在该页,若否则-1
          this.queryInfo.pagenum = 
              this.queryInfo.pagenum === 1 ? 1 : this.queryInfo.pagenum -1;
        }
         // 重新刷新列表
        this.getUserList();

    },


  },

}
</script>

<style lang="less" scoped>

</style>

