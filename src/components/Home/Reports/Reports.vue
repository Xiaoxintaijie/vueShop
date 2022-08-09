<template>
    <div>
         <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            
        </el-card>

    </div> 
</template>

<script>
export default {
    name: 'reports',
    data(){
        return {
            message: 'hello',

        }
    },
    // beforeDestroy: function () {
    //     console.group('beforeDestroy 销毁前状态===============》');
    //     console.log("%c%s", "color:red", "el     : " + this.$el);
    //     console.dir(this.$el)
    //     console.log("%c%s", "color:red", "data   : " + this.$data);
    //     console.dir(this.$data)
    //     console.log("%c%s", "color:red", "message: " + this.message);
    // },
    // destroyed: function () {
    //     console.group('destroyed 销毁完成状态===============》');
    //     console.log("%c%s", "color:red", "el     : " + this.$el);
    //     console.dir(this.$el)
    //     console.log("%c%s", "color:red", "data   : " + this.$data);
    //     console.dir(this.$data)
    //     console.log("%c%s", "color:red", "message: " + this.message)
    // },

}
</script>

<style lang="less" scoped>

</style>