<template>
  <div id="compared">
    <div class="e_card time_picker">
      <div class="title">选择对比时间</div>
      <hr>
      <div class="row">
        <div class="col-md-6">
          <el-date-picker v-model="time1" type="month" placeholder="选择月" format="timestamp"></el-date-picker>
        </div>
        <div class="col-md-6">
          <el-date-picker v-model="time2" type="month" placeholder="选择月" format="timestamp"></el-date-picker>
        </div>
      </div>
      <div class="btn_box">
        <el-button type="primary" style="margin-top: 20px;" @click="submit">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time1: "",
      time2: "",
      outList_1: [],
      outList_2: [],
      inList_1: [],
      inList_2: []
    };
  },
  methods: {
    submit() {
      if (this.time1 == "" || this.time2 == "") {
        this.$message.error("请选择日期");
      } else {
        this.time1 = this.time1;
        this.time2 = this.time2;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.time_picker {
  .el-date-editor {
    width: 100%;
  }
  .btn_box {
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>