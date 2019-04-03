<template>
  <div id="center">
    <div class="top_tab">
      <div class="tab" :class="{active: active == 'setting'}" @click="tabClick('setting')">设置</div>
    </div>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: this.$route.path.split("/").pop()
    };
  },
  methods: {
    tabClick(tab) {
      this.active = tab;
      this.$router.push("/center/" + tab);
    }
  }
};
</script>

<style lang='scss' scoped>
.top_tab {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  display: flex;
  line-height: 40px;
  overflow: hidden;
  margin-bottom: 20px;
  .tab {
    width: 100%;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
  }
  .active {
    background-color: #409eff;
    color: white;
  }
}
</style>