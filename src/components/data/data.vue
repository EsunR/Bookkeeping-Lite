<template>
  <div id="data">
    <div class="top_tab">
      <div class="tab" :class="{active: active == 1}">查看周数据</div>
      <div class="tab" :class="{active: active == 2}">查看月数据</div>
      <div class="tab" :class="{active: active == 3}">查看年数据</div>
      <div class="tab" :class="{active: active == 4}">自定义范围查看</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1
    };
  }
};
</script>

<style lang='scss' scoped>

</style>