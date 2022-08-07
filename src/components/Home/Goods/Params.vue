<template>
    <div>

        <!-- 面包屑导航 -->
        <bread>
            商品管理
            <div slot="down">分类参数</div>
        </bread>

        <!-- 卡片区 -->
        <el-card>
            <!-- 头部警告区 -->
            <!-- show-icon：感叹号 -->
            <!-- closable="false：关闭小叉图标 -->
            <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" :closable="false" show-icon>
            </el-alert>

            <!-- 选择商品分类区 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类: </span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader v-model="selectedKeys" 
                    :options="cateList" 
                    :props=" cateProps"
                     @change="handleChange"
                        clearable>
                    </el-cascader>
                </el-col>
            </el-row>

            <!-- tab页签区 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">

                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" 
                    size="mini" 
                    :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">
                        添加参数
                    </el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" 
                                       :key="index" 
                                       closable 
                                       @close="removeParamsById(index,scope.row)">
                                    {{item}}
                                    <!-- {{scope.row}} -->
                                </el-tag>
                                <!--输入文本框和按钮 -->
                                <!--.trim：去掉input之类的输入框后面的空格 -->
                                <!--解决enter和blur的冲突:  @keyup.enter="$event.target.blur()"   
                                                           @blur="handleInputConfirm(row)"  -->
                                <el-input class="input-new-tag" 
                                          v-if="scope.row.inputVisible" 
                                          v-model.trim="scope.row.inputValue"
                                           ref="saveTagInput" 
                                           size="small" 
                                           @keyup.enter.native="$event.target.blur()"
                                           @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else 
                                           class="button-new-tag" 
                                           size="small" 
                                           @click="showInput(scope.row)">
                                           + New Tag
                                </el-button>
                            </template>
                        </el-table-column>

                        <el-table-column type="index"></el-table-column>

                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!-- {{scope.row.attr_id}} -->
                                <!-- 编辑按钮 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">
                                    编辑
                                </el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeParams(scope.row.attr_id)">
                                    删除
                                </el-button>

                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" 
                    size="mini" 
                    :disabled="isBtnDisabled"
                     @click="addDialogVisible = true">
                        添加属性
                    </el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="onlyTableData " border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" 
                                       :key="index" 
                                       closable  
                                       @close="removeParamsById(index,scope.row)">
                                    {{item}}
                                </el-tag>

                                 <el-input class="input-new-tag" 
                                          v-if="scope.row.inputVisible" 
                                          v-model.trim="scope.row.inputValue"
                                           ref="saveTagInput" 
                                           size="small" 
                                           @keyup.enter.native="$event.target.blur()"
                                           @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else 
                                           class="button-new-tag" 
                                           size="small" 
                                           @click="showInput(scope.row)">
                                           + New Tag
                                </el-button>
                            </template>
                        </el-table-column>

                        <el-table-column type="index"></el-table-column>

                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!-- {{scope.row.attr_id}} -->
                                <!-- 编辑按钮 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">
                                    编辑
                                </el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeParams(scope.row.attr_id)">
                                    删除
                                </el-button>

                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-card>

        <!-- 添加对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" @close="addDialogClosed">

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" @close="editDialogClosed">

            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParam">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import bread from '../../../plugins/bread.vue'

export default {
    name: 'params',
    components:{
        bread,
    },
    data(){
        return{
            cateList: [],//保存商品分类数据，用于级联选择器显示
            manyTableData: [],//动态参数数据
            onlyTableData: [],//静态属性数据
            addForm: {
                attr_id:'',
                attr_name: '',
            },//保存添加数据名称的表单对象
            editForm: {
                attr_id: '',
                attr_name: '',
            },
            inputValue: '',//保存文本框输入内容
            cateProps: {
                // checkStrictly: true, //可以灵活选择父节点或子节点
                expandTrigger: 'hover',
                value:'cat_id',//指定选中的值
                label:'cat_name',//指定看到的值
                children: 'children',//指定值的子属性
            },//级联选择框配置对象
            selectedKeys: [], //保存级联选择器选中的id值
            activeName: 'many',//默认激活第一个页签
            addDialogVisible: false,
            editDialogVisible: false,
            // inputVisible:false,//控制按钮和文本框的切换显示
            addFormRules: {
                attr_name: [
                    { required: true, message: '请输入商品参数名', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
            },

        }
    },
    created(){
        this.getParamsList();
    },
    computed: {
        isBtnDisabled(){
        // 如果按钮需要被禁用，返回true
        // 如果选择三级参数，才能展开面板
          return (this.selectedKeys.length !== 3 ? true :  false);
        },
        cateId(){
            // 获取当前选中商品的ID值
            if(this.selectedKeys.length === 3){
                return this.selectedKeys[2];
            }
            return null;
        },
        titleText(){
            return (this.activeName === 'many' ? '动态参数' : '静态属性');
        }

    },
    methods:{
        async getParamsList() {
            // 获取所有的商品分类数据
            const { data: res } = await this.$http.get(`categories`);
            if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
            this.cateList = res.data;
            // console.log(this.cateList);
        },
        handleChange(){
            // 级联选择器选中后会打印这个函数
            // 控制只能选择三级分类

            //解决BUG： 先点击三级分类再点击二级分类，之前的列表数据未清空,
            // 只需要清空以前的manyTableData、onlyTableData

            this.getParamsData();
        },
        handleTabClick(){
            // tab页签点击事件处理函数
            // console.log(this.activeName);
            this.getParamsData();
        },
        async handleInputConfirm(input){
            // 失去焦点或者回车键触发本次事件-> 文本框变成按钮
           
            input.attr_vals.push(input.inputValue);
            // 重置为空字符串
            input.inputValue = ' ';
            // 文本框变成按钮
            input.inputVisible = false;
        
            // 发起网络请求，保存操作
            this.saveAttrVals(input);   
        },
        async getParamsData(){
            if(this.selectedKeys.length !== 3) {
                // 选中的不是三级分类，进行清空
                this.selectedKeys = [];
                this.manyTableData = [];
                this.onlyTableData = [];
                return;
            }
            //选中的是三级分类,下一步请求对应的参数数据
            // console.log(this.selectedKeys);
            const { data : res } = await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{
                    sel:this.activeName,
                }
            });
            if(res.meta.status !== 200) return this.$message.error('获取参数信息失败');
           

            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? 
                // 将字符串变成数组
                item.attr_vals = item.attr_vals.split(' ')
                // 字符串为空及变成空白的数组
                : [];

                // 控制文本框的显示与隐藏
                // 每个item单独都设置，避免出现联动效果
                item.inputValue = ' ';
                item.inputVisible = false;
            });
            // console.log(res.data);
         

            if(this.activeName === 'many') {
                 this.manyTableData = res.data;
                //  console.log(this.manyTableData);
              

            }else{
                 this.onlyTableData = res.data;
                //  console.log(this.onlyTableData);
            }

        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields();
        },
        addParams(){
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                // 预校验成功，则可以添加真正的用户请求
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName,
                });
                if (res.meta.status !== 201) return this.$message.error('添加参数信息失败');
                // console.log(res);
                this.addForm.attr_id = res.data.attr_id;
                // console.log(this.addForm);

                this.$message.success('添加参数信息成功');
                // 添加成功，关闭对话框
                this.addDialogVisible = false;
                // 重新刷新列表
                this.getParamsData();
            })
        },
        async showEditDialog(id) {
            // console.log(id);
            // 查询当前参数信息
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
                params:{
                    attr_sel: this.activeName,
                }
            });
            if (res.meta.status !== 200) return this.$message.error('查询参数信息失败');
            // console.log(res);
            this.editForm = res.data;
            // console.log(this.editForm);

            this.editDialogVisible = true;
        },
        editParam() {
            // 提交修改参数信息
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;

                const { data : res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_sel: this.activeName,
                    attr_name: this.editForm.attr_name,
                });
                if (res.meta.status !== 200) return this.$message.error('修改参数信息失败');
                this.$message.success('修改参数信息成功');
                // console.log(res);

                this.getParamsData();
                this.editDialogVisible = false;
            })
        },
        async removeParams(id){
            const confirmResult = await this.$confirm(
                '此操作将永久删除该参数, 是否继续?', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);

            if (confirmResult !== 'confirm') {
                return this.$message.info("已取消删除");
            }

            const { data : res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`);
            if (res.meta.status !== 200) return this.$message.error('删除参数信息失败');
            this.$message.success('删除参数信息成功');
            // console.log(res);

            this.getParamsData();

            this.editDialogVisible = false;

        },
        showInput(input){
            // 按钮消失不见，打开文本输入框
            input.inputVisible = true;
            // 获取到文本框DOM对象 -> 让文本框自动获取焦点
            this.$nextTick(_ => {
                // $nextTick：页面重新渲染之后，才会指定回调函数中的代码
                this.$refs.saveTagInput.$refs.input.focus();
                console.log(_);
            });
           
        },
        async saveAttrVals(input){
            // 这次的数据都是从作用域插槽上获取到的，没有在data上的
            // 把数组转化成字符串
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${input.attr_id}`, {
                attr_sel: input.attr_sel,
                attr_name: input.attr_name,
                attr_vals: input.attr_vals.join(' '),
            });
            if (res.meta.status !== 200) return this.$message.error('修改参数信息失败');
            // this.$message.success('修改参数信息成功');
            // console.log(res);
        },
        removeParamsById(index,row){
            row.attr_vals.splice(index,1);
            this.saveAttrVals(row);
        },

    },

}
</script>

<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
.el-tag{
  margin: 5px;
}
.input-new-tag{
    width: 150px;

}

// .el-table__expanded-cell[class*=cell] {
//     padding: 20px 50px;
// }
// .el-table .el-table__cell{
//     padding: 20px 50px;

// }
</style>