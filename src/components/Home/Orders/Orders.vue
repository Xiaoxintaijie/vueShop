<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--  卡片视图 -->
        <el-card>

            <el-row>
                <el-col :span="7">
                    <el-input placeholder="请输入内容"
                     v-model="queryInfo.query" 
                     clearable 
                     @clear="getOrderList()">
                        <el-button slot="append" 
                        icon="el-icon-search"
                         @click="getOrderList()">
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>

            <el-table :data="orderList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="pay_status" label="是否支付">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay_status == 0 " type="danger">未付款</el-tag>
                        <el-tag v-else type="info">已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateformat}}
                    </template>
                </el-table-column>
                <el-table-column>
                    <el-button type="info" icon="el-icon-setting" 
                            size="mini"></el-button>
                </el-table-column>
            </el-table>

            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" 
                           @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum" 
                           :page-sizes="[5, 10, 15, 20]" 
                           :page-size="queryInfo.pagesize"
                           layout="total, sizes, prev, pager, next, jumper" 
                           :total="total">
            </el-pagination>
 
        </el-card>

    </div>
</template>

<script>
export default {
    name: 'orders',
    data(){
        return {
            queryInfo:{
                query: '',
                pagenum: 1,
                pagesize: 5,
            },
            orderList: [],
            total: 0,
        }
    },
    created(){
        this.getOrderList();
    },
    methods:{
        async getOrderList() {
            // console.log(this.queryInfo);
            const { data: res } = await this.$http.get('orders', {
                params: this.queryInfo
            });
            if (res.meta.status !== 200) return this.$message.error('获取订单信息失败');
            this.orderList = res.data.goods;
            this.total = res.data.total;
            // console.log(this.orderList);
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getOrderList();
        },

    },

}
</script>

<style lang="less" scoped>

</style>