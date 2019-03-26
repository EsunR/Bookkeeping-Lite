<template>
  <div id="home">
    <div class="status card">
      <div class="title">
        <span class="mdi mdi-calendar"></span>
        今日 | {{this.$moment().format('LL')}}
      </div>
      <hr>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style lang='scss' scoped>
.status {
  .title {
    .mdi{
      font-size: 18px;
      position: relative;
      top: 2px;
    }
  }
}
</style>