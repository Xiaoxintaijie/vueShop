<template>
    <div>
         <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!--2， 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="main" style=" width:500px; height:500px "></div>
        </el-card>

    </div> 
</template>

<script>
// 1，导入
import * as echarts from 'echarts'
import _ from 'lodash';

export default {
    name: 'reports',
    data() {
        return {
            message: 'hello',
            options: {
                // 需要合并的数据 -》 lodash
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            },

        }
    },
    created(){
        // 在这里初始化 ECharts 图表会报错 ，
        // 因为初始化图标必须在页面上的的 DOM 结构完成之后
        console.group('created');
    },
    async mounted() {
        // 此时页面上的元素已经被渲染完毕了

        // 3，基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const { data: res } = await this.$http.get('reports/type/1');
        if (res.meta.status !== 200) return this.$messge.error('获取图表信息失败');
        console.group('mounted');
        console.log(res);

        // 4,指定图表的配置项和数据
        const result = _.merge(res.data,this.options);
        
        // const result = Object.assign(res.data,this.options);


        // var option = {
        //     title: {
        //         text: 'ECharts 入门示例'
        //     },
        //     tooltip: {},
        //     legend: {
        //         data: ['销量']
        //     },
        //     xAxis: {
        //         data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        //     },
        //     yAxis: {},
        //     series: [
        //         {
        //             name: '销量',
        //             type: 'bar',
        //             data: [5, 20, 36, 10, 10, 20]
        //         }
        //     ]
        // };

        // 5,使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);


    },
    methods: {
        
    },
    beforeDestroy: function () {
        console.group('beforeDestroy 销毁前状态===============》');
        console.log("%c%s", "color:red", "el     : " + this.$el);
        console.dir(this.$el)
        console.log("%c%s", "color:red", "data   : " + this.$data);
        console.dir(this.$data)
        console.log("%c%s", "color:red", "message: " + this.message);
    },
    destroyed: function () {
        console.group('destroyed 销毁完成状态===============》');
        console.log("%c%s", "color:red", "el     : " + this.$el);
        console.dir(this.$el)
        console.log("%c%s", "color:red", "data   : " + this.$data);
        console.dir(this.$data)
        console.log("%c%s", "color:red", "message: " + this.message)
    },

}
</script>

<style lang="less" scoped>

</style>