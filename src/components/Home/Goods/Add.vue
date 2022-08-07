<template>
    <div>


        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>

            <!-- 提示信息 -->
            <el-alert title="添加商品信息" type="info" :closable="false" show-icon center>
            </el-alert>

            <!-- 步骤条区 -->
            <!--finish-status: 设置结束步骤的状态 -->
            <!--align-center:文本居中暂时  -->
            <!--:active：用来指定激活项的索引  -->
            <!-- activeIndex - 0: 类型转换String->Number -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>


            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">

                <!--tab-position: 选项卡所在位置 -->
                <!--name: 与选项卡绑定值 value 对应的标识符，表示选项卡别名  String类型-->
                <!-- value / v-model: 绑定值，选中选项卡的 name  String类型-->
                <!--@tab-click: tab 被选中时触发，他的返回值是被选中的标签 tab 实例 -->
                <!-- before-leave: 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。 -->
                <el-tabs v-model="activeIndex" 
                         tab-position="left" 
                         :before-leave="beforeTabLeave"
                         @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model.number="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model.number="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model.number="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat" 
                            :options="catelist" 
                            :props=" cateProps"
                                @change="handleChange" 
                                clearable>
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in manyTableData" :label="item.attr_name" :key="item.attr_id">

                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox v-for="(cd,index) in item.attr_vals" :key="index" :label="cd" border>
                                </el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals">
                            </el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">

                        <!-- action: 图片上传的地址 -->
                        <!-- on-preview: 处理图片预览效果 -->
                        <!-- on-remove：处理移除图片的操作 -->
                        <!-- list-type： 指定当前预览组件的呈现方式 -->
                        <!-- headers: 设置上传的请求头部 -->
                        <!-- 图片上传成功只是暂存在服务器中，没有axios请求，也没有保存在表单中 -->
                        <el-upload :action="uploadUrl" 
                                   :on-preview="handlePreview" 
                                   :on-remove="handleRemove"
                                   :on-success="handleSuccess" 
                                   list-type="picture" 
                                   :headers="headerObj"
                                    multiple>

                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>

                        </el-upload>

                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">

                        <div class="ql-container ql-snow">
                             <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        </div>

                        <el-button type="primary" size="mini" 
                                   class="btnAdd" @click="add()">
                                   添加按钮
                        </el-button>

                    </el-tab-pane>
                </el-tabs>

            </el-form>


        </el-card>

        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>


    </div>
</template>

<script>
import _ from 'lodash'
export default {
    name:'add',
    data(){

        // var validateNumber = (rule, value, callback) => {
        //     // console.log('value:' + value)
        //     if (!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value)) {
        //         callback(new Error('请输入数字值'))
        //     } else {
        //         callback()
        //     }
        // }

        return{
            activeIndex: "0",//保存激活项的字符串类型数据
            catelist: [],//保存商品分类数据
            // selectedKeys: [],//保存选中的父级分类的ID数组
            cateProps:{
                checkStrictly: false, //不可以灵活选择父节点或子节点
                expandTrigger: 'hover',
                value:'cat_id',//指定选中的值
                label:'cat_name',//指定看到的值
                children: 'children',//指定值的子属性
            },//级联选择器规则
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],//数组形式存放，但是请求要用字符串
                goods_introduce: '',
                pics: [],
                attrs: [],//数组形式存放，但是请求要用字符串
            },//添加商品的表单数据项
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },//规则
            manyTableData: [],
            onlyTableData: [],
            uploadUrl: "https://lianghj.top:8888/api/private/v1/upload",//上传图片后台地址
            headerObj: {
                Authorization:window.sessionStorage.getItem('token'),
            },
            previewPath: '',
            previewVisible: false,
        }
    },
    created(){
        this.getCateList();
    },
    computed:{
        cateId(){
            // 返回级联选择器被选中的三级参数信息
            if(this.addForm.goods_cat.length === 3){
                return this.addForm.goods_cat[2];
            }
            return null;
        },
    },
    methods:{
        async getCateList() {
            // 获取商品分类数据，用于级联选择器
            const { data: res } = await this.$http.get('categories', {
                params: this.queryInfo
            });
            if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')

            this.catelist = res.data;
            // console.log(this.catelist);

        },
        handleChange(){
            // 级联选择器选中后会打印被选中的值，即selectedKeys
            // 保证只能选中三级参数
            if(this.addForm.goods_cat.length !== 3) {
                // 选中的不是三级分类，进行清空
                this.addForm.goods_cat = [];
                return;
            }
            // console.log(this.addForm);
        },
        beforeTabLeave(activeName, oldActiveName){
            // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
            // console.log('即将离开的标签页名字是：' + activeName);
            // console.log('即将进入的标签页名字是：' + oldActiveName);
            // return false;

            // activeName等类型是String
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
                this.$message.error('请先选择商品分类 !');
                return false;
            }
        },
        async tabClicked(tab) {
            // 根据选择的是动态参数面板还是静态参数面板来实现对应的加载
            // tab 被选中时触发，他的返回值是被选中的标签 tab 实例
            // 也可以用this.activeIndex作为判断条件

            // console.log(typeof tab.index);
            // console.log(tab);

            // tab.index的类型是String
            if (tab.index === '1') {
                const { data : res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel: 'many',
                    }
                });

                if (res.meta.status !== 200) {
                    return this.$message.error('获取动态参数信息失败！');
                }
                // console.log(res);

                // 多选框需要绑定数组，所以进行转换
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ?
                        // 将字符串变成数组
                        item.attr_vals = item.attr_vals.split(' ')
                        // 字符串为空及变成空白的数组
                        : [];
                });

                this.manyTableData = res.data;
                // console.log(this.manyTableData);

            } else if ( tab.index === '2') {
                const { data : res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel: 'only',
                    }
                });

                if (res.meta.status !== 200) {
                    return this.$message.error('获取静态属性信息失败！');
                }
                // console.log(res);

                // 这里不需要 String -> Array
                // res.data.forEach(item => {
                //     item.attr_vals = item.attr_vals ?
                //         // 将字符串变成数组
                //         item.attr_vals = item.attr_vals.split(' ')
                //         // 字符串为空及变成空白的数组
                //         : [];
                // });

                this.onlyTableData = res.data;
                // console.log(this.onlyTableData);
            }

        },
        handlePreview(file){
            // 设置预览窗口
            // file.url: String
            //  console.log( file );
             this.previewPath = file.url;
             this.previewVisible = true;
        },
        handleRemove(file){
            // 界面上的图片可以点小叉删除，但是存放在addForm中的图片信息没有被删除
            // console.log(file);
            //  1,获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path;

            //  2，从pic数组中，找到这个图片对应的索引值
            // findIndex返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1
            // const picIndex =  this.addForm.pics.findIndex(item => item.pic === filePath)

            //  3，用数组的splice方法删除图片信息
            // this.addForm.pics.splice(picIndex,1);

            // filter过滤会得到一个新数组，可以替换掉  2、3步
            this.addForm.pics = this.addForm.pics.filter(item => item.pic !== filePath)

            // console.log(this.addForm);
        },
        handleSuccess(response){
            // 监听图片上传成功事件
            // console.log(response);

            //拼接得到一个图片信息对象
            const picInfo = {pic: response.data.tmp_path};
            // 添加到数组中
            this.addForm.pics.push(picInfo);
            // console.log(this.addForm);
        
        },
        add(){
            // 添加商品
            // console.log(this.addForm);
            // console.log(this.manyTableData);
            // console.log(this.onlyTableData);
            // console.log(typeof this.addForm.goods_weight);

            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请填写必要的表单项');
                // 1,判断是否符合规则-》2，获取请求需要的数值，包括转换-》3，请求添加

                // 获取"attrs"数组信息
                // forEach () 方法不会返回执行结果, 而是 undefined. 
                //      也就是说, forEach () 会修改原来的数组. 
                //      而 map () 方法会得到一个新的数组并返回.
                this.manyTableData.forEach(item => {
                    // 之前获取 manyTableData 中的 attr_vals 把它转化为了 Array ,现在转化回 String

                    const newInfo = {
                        "attr_id": item.attr_id,
                        "attr_value": item.attr_vals.join(' '),
                    };
                    this.addForm.attrs.push(newInfo);
                })

                this.onlyTableData.forEach(item => {
                    const newInfo = {
                        "attr_id": item.attr_id,
                        "attr_value": item.attr_vals,
                    };
                    this.addForm.attrs.push(newInfo);
                })

                //   这种方法是浅拷贝，改变对象的值源对象也会变
                // this.addForm.goods_cat = this.addForm.goods_cat.join(' ');

                // cloneDeep 深拷贝   
                // "goods_cat"数组变成字符串形式
                const form = _.cloneDeep(this.addForm);
                form.goods_cat = form.goods_cat.join(',');

                console.log(form);
                // console.log(typeof this.addForm.goods_price);
                // console.log(form == this.addForm); false

                const { data: res } = await this.$http.post('goods', form);
                if (res.meta.status !== 400) return this.$message.error('添加商品信息失败');
                this.$message.success('添加商品信息成功');
 
                console.log(res);
                this.$router.push('/goods');


            });

        },

    },

}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg{
    width: 100%;
}
.btnAdd{
    margin-top: 15px;;
}
</style>

