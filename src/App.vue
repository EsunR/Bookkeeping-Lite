<template>
  <el-container>
    <el-header id="tobar" class="shadow_base">
      <div class="title">
        <span class="mdi mdi-book"></span> 记账薄
        <span class="subtitle">| Bookkeeping</span>
      </div>
      <el-menu :default-active="'home'" class="nav_menu" mode="horizontal" @select="handleSelect">
        <el-menu-item index="home">记账薄</el-menu-item>
        <el-menu-item index="data">数据</el-menu-item>
        <el-menu-item index="center">个人中心</el-menu-item>
      </el-menu>
    </el-header>
    <div id="main" class="container">
      <transition>
        <router-view></router-view>
      </transition>
    </div>
  </el-container>
</template>

<script>
export default {
  methods: {
    handleSelect(index) {
      this.$router.push("/" + index);
    }
  }
};
</script>

<style lang="scss" scoped>
#tobar {
  display: flex;
  background-color: #fff;
  .title {
    background-color: #fff;
    line-height: 60px;
    width: 50%;
    color: rgba(0, 0, 0, 0.8);
    font-size: 1.3rem;
    font-weight: lighter;
  }
  .nav_menu {
    width: 50%;
    li {
      float: right !important;
    }
  }
  @media screen and (max-width: 550px) {
    .title {
      font-size: 16px;
      width: 28%;
      .subtitle {
        display: none;
      }
    }
    .nav_menu {
      width: 100%;
    }
  }
}
#main{
  margin-top: 20px;
}
</style>


