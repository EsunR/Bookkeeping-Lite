<template>
  <div id="data">
    <div class="top_tab">
      <div class="tab" :class="{active: active == 'week'}" @click="tabClick('week')">周数据</div>
      <div class="tab" :class="{active: active == 'month'}" @click="tabClick('month')">月数据</div>
      <div class="tab" :class="{active: active == 'compared'}" @click="tabClick('compared')">数据对比</div>
      <div
        class="tab"
        :class="{active: active == 'customize'}"
        @click="tabClick('customize')"
      >自定义</div>
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
      active: "week"
    };
  },
  methods: {
    tabClick(tab) {
      this.active = tab;
      this.$router.push("/data/" + tab);
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
    width: 25%;
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