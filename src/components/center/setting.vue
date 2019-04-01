<template>
  <div id="setting">
    <div class="sort_manage e_card">
      <div class="title">管理分类</div>
      <hr>
      <div class="sort_list">
        <el-tag
          v-for="item in sort"
          :key="item.id"
          :closable="item.status != 0"
          @close="deleteSort(item.id)"
          :type="item.status == 0 ? 'info' : ''"
        >{{item.sort}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput"
          type="danger"
        >+ New Tag</el-button>
      </div>
    </div>
    <div class="display e_card">
      <div class="title">首页开启还款提醒</div>
      <el-switch
        v-model="repayment"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="repaymentChange"
      ></el-switch>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sort: [],
      inputValue: "",
      inputVisible: false,
      switch: "",
      repayment: Boolean(localStorage.getItem("repayment"))
    };
  },
  methods: {
    getSort() {
      this.axios
        .get("/getSort")
        .then(res => {
          if (res.data.code == 1) {
            this.sort = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接，获取消费类型失败");
        });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.axios
          .get("/addSort?sort=" + inputValue)
          .then(res => {
            if (res.data.code == 1) {
              this.getSort();
            }
          })
          .catch(err => {
            console.log(err);
            this.$message("服务器无法连接，添加分类失败");
          });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    deleteSort(id) {
      this.axios
        .get("/deleteSort?id=" + id)
        .then(res => {
          if (res.data.code == 1) {
            this.getSort();
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    repaymentChange(val) {
      if (val) {
        localStorage.setItem("repayment", 1);
      } else {
        localStorage.setItem("repayment", "");
      }
    }
  },
  mounted() {
    this.getSort();
    console.log();
  }
};
</script>

<style lang='scss' scoped>
.sort_list {
  .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .input-new-tag {
    width: 90px;
    vertical-align: bottom;
    margin-bottom: 10px;
  }
}
.display {
  display: flex;
  justify-content: space-between;
}
</style>