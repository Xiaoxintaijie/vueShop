<template>
  <div>
    <p>Welcome</p> 
    <div>
    <p>🥗🎠❤️😍😊😂🤣💕😘👌😎😒😁👍🙌🤦‍♀️</p>  
    <p>🤦‍♂️🤷‍♀️😢🎶😉🤞✌️🤷‍♂️😀😁😂🤣😃😄😎😋</p>
    <p>😉😆😆😅😍🥰😗😙🥲🤔🤩🤗☺️😚🤨😐😑</p>
    <p>😶😶‍🌫️🙄😯🤐😥😣😏😪😫🥱😴😌😛😔😓😒</p>
    <p>🤤😝😜😕🙃🤑😲🙁☹️😭😢😤😟😞😖😦😧</p>
    <p>😨😩🤯😬😳🥶😱😰😰😮‍💨👶👨‍🦰👩‍🦰🍕🧂🧈🍳</p>
    <p>🥓🖤💓💞❣️🧡💛💚💙💜💘💝💟💌💢💥</p>
    </div>

    <el-divider></el-divider>

    <div>
      <p>推荐一个颜色漂亮并且种类丰富的网站：
        <!--.prevent:防止跳转到新页面的时候，老页面退出登录  -->
        <el-link type="success" href="" @click.prevent="jump()">中国色</el-link>
      </p>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data(){
    return {
      colors: 'http://zhongguose.com/#meijianghong',
    }
  },
  methods: {
    jump() {
      // 打开链接，打开一个新页面，而不是在原页面的基础上跳转
      window.open(this.colors);
      return false;
    },
  },

}
</script>

<style lang="less" scoped>

</style>