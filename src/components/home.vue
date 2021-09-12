<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="loginLogo" src="../assets/logo.png" alt="" />
        <span>电商后台管理</span>
      </div>
      <el-button class="loginOut" type="info" @click="loginOut">
        退出登录
      </el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '55.99px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#359bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="Navstatus"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="submenuItem.id + ''"
            v-for="submenuItem in menuList"
            :key="submenuItem.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[submenuItem.id]"></i>
              <!-- 文本 -->
              <span>{{ submenuItem.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + menuItem.path"
              v-for="menuItem in submenuItem.children"
              :key="menuItem.id"
              @click="saveNavstatus('/' + menuItem.path)"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ menuItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],

      // 图标数据
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },

      isCollapse: false,

      // 高亮
      Navstatus: '',
    };
  },
  created() {
    this.getMenuList();
    this.Navstatus = window.sessionStorage.getItem('activePath');
  },

  methods: {
    //  退出功能
    loginOut() {
      // 删除token
      window.sessionStorage.removeItem('token');
      this.$router.push('/login');
    },

    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus');
      // 请求失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 请求成功
      this.menuList = res.data;
    },

    // 折叠左侧边栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    // 保存高亮的值
    saveNavstatus(navstatus) {
      window.sessionStorage.setItem('activePath', navstatus);
      this.Navstatus = navstatus;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  background-color: #363d40;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    > .loginLogo {
      height: 50px;
      width: 51px;
      margin-right: 10px;
      border-radius: 30px;
      border: 1px solid #e9edf1;
      box-shadow: 0 0 10px #e9edf1;
      background-color: #e9edf1;
    }
  }
  > .el-button {
    height: 40px;
  }
}
.el-aside {
  background-color: #313743;
}
.el-main {
  background-color: #e9edf1;
}
.el-menu {
  border-right: none;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  text-align: center;
  line-height: 24px;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #ffff;
}
</style>
