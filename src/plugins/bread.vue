<template>
  <div>
    <!-- 需要参考类写样式 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
           首页
      </el-breadcrumb-item>

      <el-breadcrumb-item >
         <slot >1</slot>
      </el-breadcrumb-item>

      <el-breadcrumb-item >
         <slot name="down">2</slot>
      </el-breadcrumb-item>

    </el-breadcrumb>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>

</style>