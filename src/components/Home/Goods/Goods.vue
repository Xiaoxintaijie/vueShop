<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <!-- gutter: 栅格间隔 -->
            <el-row :gutter="20">

                <el-col :span="7">
                    <el-input placeholder="请输入内容" 
                              v-model="queryInfo.query" 
                              clearable
                              @clear="getGoodsList()">
                        <el-button slot="append" 
                                   icon="el-icon-search" 
                                   @click="getGoodsList()">
                        </el-button>
                    </el-input>
                </el-col>

                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 商品列表展示区域 -->
            <el-table border stripe :data="goodList">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="价格(元)"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
                <el-table-column prop="add_time" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateformat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- <el-button type="primary" icon="el-icon-edit" size="mini">
                        </el-button> -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" 
                        @click="removeGoodsById(scope.row.goods_id)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区 -->
            <!-- background:加一个背景 -->
            <el-pagination @size-change="handleSizeChange" 
                           @current-change="handleCurrentChange"
                          :current-page="queryInfo.pagenum" 
                          :page-sizes="[5, 10, 15, 20]" 
                          :page-size="queryInfo.pagesize"
                          layout="total, sizes, prev, pager, next, jumper" 
                          :total="total"
                          background>
            </el-pagination>
        </el-card>

        

    </div>
</template>

<script>
export default {
    name: 'goods',
    data(){
        return {
            queryInfo: {
                query: '',   //搜索关键字
                pagenum: 1,   //当前页数
                pagesize: 5,  //当前每页显示多少条数据
            },//保存查询商品信息的条件
            goodList: [],//保存获取到的商品信息
            total: 0,//保存当前商品信息的总条数
          
        }
    },
    created(){
        this.getGoodsList();
    },
    methods:{
        async getGoodsList(){
            const { data : res } = await this.$http.get('goods',{
                params: this.queryInfo
            });
            if(res.meta.status !== 200) return this.$message.error('获取商品信息失败');
            this.goodList = res.data.goods;
            this.total = res.data.total;
            console.log(this.goodList);
            // console.log(this.queryInfo);
        },
        handleSizeChange(newSize){
            //分页区  每页展示多少条数据 重置数据让后重置请求
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },
        handleCurrentChange(newPage){
            //分页区 展示到第几页
            this.queryInfo.pagenum = newPage;
            this.getGoodsList();
        },
        async removeGoodsById(id) {
            const confirmResult = await this.$confirm(
                '此操作将永久删除该商品, 是否继续?', '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);

            if (confirmResult !== 'confirm') {
                return this.$message.info("已取消删除");
            }

            const { data: res } = await this.$http.delete('goods/' + id)
            if (res.meta.status !== 200) return this.$message.error('删除商品信息失败');
            this.$message.success('删除商品信息成功');

            this.getGoodsList();

        },
        goAddPage(){
            // 访问新路径
            this.$router.push('/add');
        },
        
    },

}
</script>

<style lang="less" scoped>

</style>