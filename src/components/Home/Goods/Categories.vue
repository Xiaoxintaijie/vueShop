<template>
  <div>
<!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

<!-- 卡片区 -->
    <el-card>
        <!-- 添加按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddDialog">添加分类</el-button>
            </el-col>
        </el-row>

        <!-- 数据展示 -->
        <!-- :data 指定当前数据源 -->
        <!-- show-index 显示数据索引列 -->
        <!--  index-text 设置数据索引昵称 -->
        <!-- :is-fold  树形表格中父级是否默认折叠 -->
        <tree-table :data="catelist" 
                    :columns="columns"
                    :selection-type = "false"
                    :expand-type = "false"
                    show-index 
                    index-text='#' 
                    border 
                    class="treeTable">
                    <!-- 模板一：是否有效 -->
                    <template slot="isok" slot-scope="scope">
                        <i class="el-icon-success" 
                           v-if="scope.row.cat_deleted === false" 
                           style="color: lightgreen"></i>
                        <i class="el-icon-error" 
                           v-else 
                           style="color: lightred"></i>
                    </template>
                    <!-- 模板二：排序 -->
                    <template slot="order" slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                        <el-tag type="warning" size="mini" v-else>三级</el-tag>
                    </template>
                    <!-- 模板三：操作 -->
                    <template slot="opt" slot-scope="scope">
                        <el-button type="primary" 
                                   icon="el-icon-edit" 
                                   size="mini" 
                                   @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                        <el-button type="danger" 
                                   icon="el-icon-delete" 
                                   size="mini" 
                                   @click="removeCaterById(scope.row.cat_id)">删除</el-button>
                    </template>
                    
        </tree-table>
        
    </el-card>

<!-- 分页区 -->
    <el-pagination  @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum" 
                    :page-sizes="[3, 5, 10, 15]" 
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" 
                    :total="total">
    </el-pagination>

    <!-- 添加分类的对话框 -->
     <el-dialog title="添加分类" 
                :visible.sync="addDialogVisible" 
                width="50%" 
                @close="addDialogClosed">

      <!-- 内容主题区:添加分类的表单 -->
      <el-form :model="addForm" 
               :rules="addFormRules" 
                ref="addFormRef" 
                label-width="100px">

        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类" >
            <!-- options: 指定数据源 -->
            <!-- value / v-model 选中项绑定值 -->
            <!-- props: 有关菜单配置对象 -->
            <!-- clearable 清空选项 小叉 -->
             <el-cascader
                 v-model="selectedKeys"
                :options="parentCateList"
                :props="cascaderProps"
                @change="parentCateChanged" 
                clearable>
             </el-cascader>
        </el-form-item>
        
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog  title="编辑分类" 
                :visible.sync="editDialogVisible" 
                width="50%" >
        <!-- 主题内容区 -->
        <el-form :model="editForm" 
                 :rules="addFormRules" 
                 ref="editFormRef" 
                 label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="editForm.cat_name"></el-input>
            </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate()">确 定</el-button>
        </span>

    </el-dialog>

   

  </div>
</template>

<script>
export default {
    name:'categories',
    data(){
        return {
            queryInfo: {
                type: 3,    //搜索参数
                pagenum: 1,   //当前页码值
                pagesize: 5,  //当前每页显示多少条数据
            },//查询商品分类信息的条件
            catelist: [],//商品分类的数据列表
            parentCateList: [],//保存商品父级分类的数据列表
            selectedKeys:[],//选中的父级分类的ID数组,可能选中的ID数量不只一个，所以用数组形式
            total:0,//总数据条数
            columns: [
            {
                label: '分类名称',
                prop: 'cat_name',
            },
            { 
                label: '是否有效',
                type: 'template',//表示将当前列定义成模板列
                template: 'isok' ,//表示当前列所在的模板名称
            },
            { 
                label: '排序',
                type: 'template',//表示将当前列定义成模板列
                template: 'order' ,//表示当前列所在的模板名称
            },
            { 
                label: '操作',
                type: 'template',//表示将当前列定义成模板列
                template: 'opt' ,//表示当前列所在的模板名称
            },
            ],//每一个对象都是展示列的定义对象
            addDialogVisible: false,//控制添加对话框的显示与隐藏
            editDialogVisible: false,//控制编辑对话框的显示与隐藏
            addForm:{
                cat_name:'',
                cat_pid: 0,
                cat_level: 0,//当前分类等级默认是一级
            },//保存添加商品分类的表单数据
            editForm:{
                cat_id:'',
                cat_name: '',
            },//保存修改商品分类的表单数据
            addFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                cat_pid:[

                ],
            },//添加表单验证规则对象
            cascaderProps: {
                checkStrictly: true, //可以灵活选择父节点或子节点
                expandTrigger: 'hover',
                value:'cat_id',//指定选中的值
                label:'cat_name',//指定看到的值
                children: 'children',//指定值的子属性
            },//级联选择器有关菜单配置对象
        
        }
    },
    created(){
        this.getCateList();
    },
    methods:{
        async getCateList(){
            // 获取商品分类的数据
        const {data:res} =await this.$http.get('categories',{
                params:this.queryInfo
            });
        if(res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
     
        this.catelist = res.data.result;
        this.total = res.data.total;
        // console.log( this.catelist);

        },
        handleSizeChange(newSize){
            // 监听pagesize改变
            this.queryInfo.pagesize = newSize;
            // 刷新数据改变
            this.getCateList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        async getParentCateList(){
            // 只需要前两级分类就可以了，因为添加到第三级不需要显示第三级数据
            const {data:res} =await this.$http.get('categories',{
                params: {type: 2}
            });
            if(res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
            // console.log(res);
            this.parentCateList = res.data;
        },
        showAddDialog(){
            // 获取父级分类数据列表
            this.getParentCateList();
            this.addDialogVisible = true;
        },
        parentCateChanged(){
            // 监听选择项发生变化 -> 选中项数组发生变化
            //  console.log(this.selectedKeys);
            //  console.log(this.addForm);
            // 如果选中项数组长度不为0,说明发生变化
            if(this.selectedKeys.length > 0){
                // 数组最后一个ID值为新加入分类的父级ID
                // 取最后一个ID值赋值
                // 数组长度值和新加入分类的level值有关
               this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
               this.addForm.cat_level = this.selectedKeys.length;
                // console.log(this.addForm);
               return;
            }else{
                // 没有选择就重置保存父选项的值
                this.addForm.cat_pid = 0;
                this.addForm.cat_level = 0;
                //  console.log(this.addForm);
            }
             

        },
        addCate(){
            // 实现添加按钮 
            // 因为关闭对话框会重置this.addForm，所以最后输出的还是一开始默认的值
                //   console.log(this.addForm);

            // 如果未选择父级分类，那可能想设置的是一级分类，不能算报错
            // 此时addform里面的 cat_pid = 0; cat_level = 0;
               
            this.$refs.addFormRef.validate(async valid => {

                if (!valid) return;
                // 预校验成功，则可以添加真正的用户请求

                const { data : res } =await this.$http.post('categories',this.addForm);
                if(res.meta.status !== 201) return this.$message.error('添加分类信息失败');
                this.$message.success('添加分类信息成功');
                // console.log(res);

                // 刷新列表数据
                this.getCateList();
                // 关闭对话框
                this.addDialogVisible = false;
            })
    
        },
        addDialogClosed(){
            // 表单重置方法
            this.$refs.addFormRef.resetFields();
            // 设置选项为空
            this.selectedKeys = [];
            this.addForm.cat_pid = 0;
            this.addForm.cat_level = 0;
        },
        async showEditDialog(id){
             // 展示商品类别编辑的对话框
            // console.log(id);
            const { data : res } = await this.$http.get('categories/' + id);
            if (res.meta.status !== 200) return this.$message.error('查询商品类别信息失败');
            this.editForm = res.data;
            // console.log(this.editForm);

            this.editDialogVisible = true;
        },
        editCate(){
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.put("categories/" + this.editForm.cat_id, {
                   cat_name: this.editForm.cat_name,
                });
                if (res.meta.status !== 200) return this.$message.error('修改商品分类信息失败');
                this.$message.success('修改商品分类信息成功');
                // console.log(res);

                this.getCateList();
                this.editDialogVisible = false;
            })
        },
        async  removeCaterById(id){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该分类信息, 是否继续?', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);

            if (confirmResult !== 'confirm') {
                return this.$message.info("已取消删除");
            }

            const { data: res } = await this.$http.delete('categories/' + id)
            if (res.meta.status !== 200) return this.$message.error('删除用户商品分类信息失败');
            this.$message.success('删除商品分类信息成功');
            console.log(this.queryInfo);

            // 一页一条数据的情况：判断当前展示的用户数据是否只有一条
            if (this.catelist.length === 1) {
                //若是，则继续判断页码是否已经在第一页，若是则保持在该页,若否则-1
                this.queryInfo.pagenum =
                    this.queryInfo.pagenum === 1 ? 1 : this.queryInfo.pagenum - 1;
            }

            this.getCateList();

        },

    },

}
</script>

<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
.el-cascader {
    width:100%
}
</style>