<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <el-row>
        <el-col>
          <!-- 添加按钮 -->
          <el-button type="primary" @click="addDialogVisible = true">
            添加角色
          </el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格系统布局 -->
            <el-row v-for="(item1,index1) in scope.row.children" 
                   :key="item1.id"
                   :class="['bdbottom',index1 === 0 ? 'bdtop' : '','vcenter']">
              <!-- 渲染一级权限 -->
              <!-- :span="5"  表示占五列 总共24列-->
              <!-- closable 小叉，定义一个标签是否可移除 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                  {{item1.authName + index1}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <!-- 把19做分成24列 -->
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item1.children" 
                       :key="item2.id"
                       :class="[index2 === 0 ? ' ' : 'bdtop','vcenter']">

                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName + index2}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag v-for="(item3,index3) in item2.children" 
                           :key="item3.id" 
                           type="warning" 
                           closable
                           @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName + index3}}
                    </el-tag>
                  </el-col>

                </el-row>

              </el-col>
            </el-row>

            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleName" label="角色描述">
        </el-table-column>
        <el-table-column prop="path" label="操作">
          <template slot-scope="scope">
            <!-- {{scope.row.id}} -->
            <el-button type="primary" icon="el-icon-edit" size="mini" 
            @click="showEditDialog(scope.row.id)">
              编辑
            </el-button>

            <el-button type="danger" icon="el-icon-delete" size="mini" 
            @click="removeUserById(scope.row.id)">
              删除
            </el-button>

            <el-button type="warning" icon="el-icon-setting" size="mini" 
            @click="showSetRightDialog(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" 
    :visible.sync="addDialogVisible" 
    width="50%"
    @close="addDialogClosed">
      <el-form :model="addForm" 
      :rules="addFormRules" 
      ref="addFormRef" 
      label-width="100px">
        <el-form-item label="角色名称" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog title="编辑角色" 
    :visible.sync="editDialogVisible" 
    width="50%" 
    @close="editDialogClosed">
      <el-form :model="editForm" 
      :rules="addFormRules" 
      ref="editFormRef" 
      label-width="100px">
        <el-form-item label="角色名称" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" 
               :visible.sync="setDialogVisible" 
               width="50%" 
               @close="setRightDialogClosed">

      <!-- 树形控件 -->
      <!-- node-key:每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 -->
      <!-- default-expand-all:是否默认展开所有节点 -->
      <el-tree :data="rightsTree" 
               :props="treeProps" 
               show-checkbox 
               node-key="id" 
               default-expand-all
               :default-checked-keys="defKeys" 
               ref="treeRef">
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addlotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name:'role',
  data(){
    return {
      rolesList: [],//存放所有角色列表数据
      addDialogVisible:false,//控制添加对话框的显示与隐藏
      editDialogVisible:false,//控制修改对话框的显示与隐藏
      setDialogVisible:false,//控制分配权限的对话框显示与隐藏
      addForm:{
        roleDesc:'',
        roleName:'',
      },//保存添加角色的表单数据
      editForm:{
        roleDesc:'',
        roleName:'',
        roleId:'',
        rolePermissionDesc:'',
      },//保存编辑角色的表单数据
      rightsTree:{},//保存分配权限的数据
      defKeys:[],//默认选中的节点ID值数组
      roleId:'',//当前即将分配权限的角色ID
      treeProps:{
        label: 'authName',
        children: 'children',
      },//树形控件的属性绑定对象

      addFormRules:{
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
      },//添加表单验证规则对象

    }
  },
  created(){
    this.getRolesList();
  },
  methods:{
    async  getRolesList(){
      // 获取所有角色的列表信息
      const { data : res } = await this.$http.get('roles');
      if(res.meta.status !== 200) return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      // console.log( this.rolesList );
    },
    addRole(){
      // 添加新角色
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return;
        const { data:res } = await this.$http.post('roles', this.addForm);
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error('添加角色信息失败');
        this.$message.success('添加角色信息成功');
         // 添加角色成功，关闭对话框
        this.addDialogVisible = false;
        // 重新刷新列表
        this.getRolesList();
      }) 

    },
    addDialogClosed(){
      // 监听添加角色对话框的关闭事件
      // resetFields:表单重置方法 重置表单验证
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addFormRef.resetFields();
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    setRightDialogClosed(){
      // 监听分配权限的对话框关闭以后
      // 需要清空保存上一个节点ID值的数组
      this.defKeys = [];

    },
    async  showEditDialog(id){
      // 展示编辑角色的对话框
      this.editDialogVisible = true;
      const { data:res } = await this.$http.get('roles/'+id);
      if (res.meta.status !== 200) return this.$message.error("查询角色信息失败")
      // console.log(res);
      this.editForm = res.data;
      // console.log(this.editForm);
    },
    editRole(){
      // 与验证编辑角色内容和请求编辑角色
      this.$refs.editFormRef.validate(async valid  => {
        if(!valid) return this.$message.error('修改角色信息失败')

        const { data:res } = await this.$http.put('roles/'+this.editForm.roleId,{
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc,
        });
        if(res.meta.status !== 200) return this.$message.error('修改角色信息失败');
        this.$message.success('修改角色信息成功');
        // console.log(res);

        // 添加用户成功，关闭对话框
        this.editDialogVisible = false;
        // 重新刷新列表
        this.getRolesList();
      })
    },
    async  removeUserById(id){
      // 根据ID删除对应的角色信息
      // 首先确认是否删除
      const confirmResult = await this.$confirm(
          '此操作将永久删除该角色, 是否继续?', '提示', 
          {
             confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning'
          }).catch(err => err);
      
      if(confirmResult !== 'confirm'){
          return this.$message.info("已取消删除");
      }

      const { data:res } = await this.$http.delete('roles/'+id)
      if (res.meta.status !== 200) return this.$message.error('删除角色信息失败');
      this.$message.success('删除角色信息成功');
      // console.log(res);

      // 重新刷新列表
      this.getRolesList();
    },
    async  removeRightById(role,rightId){
      // console.log(role,rightId);
      // 删除可移除的标签
      const confirmResult = await this.$confirm(
          '此操作将永久删除该权限, 是否继续?', '提示', 
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);

      if(confirmResult !== 'confirm'){
          return this.$message.info("已取消删除");
      }

      const { data:res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限信息失败');
      this.$message.success('删除权限信息成功');
      console.log(res);

      // 不建议重新刷新
      // delete删除会返回roleid所有权限
      // 可以重新赋值加载
      role.children = res.data;

    },
    async  showSetRightDialog(role){
      // 显示分配权限的对话框
      // 先获取所有的权限数据
      this.roleId = role.id;
      const { data : res } = await this.$http.get('rights/tree');
      if(res.meta.status !== 200) return this.$message.error("获取权限列表失败");
      this.rightsTree = res.data;
      // console.log(this.rightsTree);

      // 递归三级节点的ID
      this.getLeafKeys(role,this.defKeys);
      // console.log(this.defKeys)
      // console.log(role)

      this.setDialogVisible = true;

    },
    getLeafKeys(node,arr){
      // 通过递归的形式，获取角色所有三级权限的id
      // 并保存到数组中
     // 因为现在主要是获取三级节点，因为三级节点没有children，
     //所以我们去判断，如果没有子节点那我们就把当前的节点的id，push到arr数组
      if(!node.children){
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafKeys(item,arr);
      })

    },
    async  addlotRights(){
      // 点击为角色分配权限
      // getCheckedKeys: 返回目前被选中的节点的 key 所组成的数组
      // getHalfCheckedKeys:返回目前半选中的节点的 key 所组成的数组
      // join() 方法用于把数组中的所有元素转换一个字符串。
      //       元素是通过指定的分隔符进行分隔的。
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
     
      // console.log(keys);
      const idStr = keys.join(',');
      // console.log(idStr);
     
      const {data:res} =await this.$http.post(`roles/${this.roleId}/rights`,{ rids:idStr});
      if (res.meta.status !== 200) return this.$message.error('分配权限信息失败');
      this.$message.success(res.meta.msg);
      // console.log(res);
 
      // 重新刷新列表，对应展开列数据会重新渲染
      this.getRolesList();

      this.setDialogVisible = false;

    },
    
  },

}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
// 由每一行每一列开头第一个决定怎么用
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom:1px solid #eee;
}
.vcenter{
  // 纵向对齐
  display: flex;
  align-items: center;
}

</style>