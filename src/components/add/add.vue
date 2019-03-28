<template>
  <div id="add">
    <div class="top_tab">
      <div class="tab" :class="{active: active == 1}" @click="addOut">添加支出</div>
      <div class="tab" :class="{active: active == 2}" @click="addIn">添加收入</div>
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
      active: 1
    };
  },
  methods: {
    addOut() {
      this.active = 1;
      this.$router.push("/add/addExpenditure");
    },
    addIn() {
      this.active = 2;
      this.$router.push("/add/addIncome");
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
    width: 50%;
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