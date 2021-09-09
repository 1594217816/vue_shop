<template>
  <div><el-button type="info" round @click="loginOut">退出登录</el-button></div>
</template>
<script>
export default {
  methods: {
    //  退出功能
    loginOut() {
      // 删除token
      window.sessionStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
};
</script>
<style>
</style>
