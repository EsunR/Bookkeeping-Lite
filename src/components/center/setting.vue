<template>
  <div id="setting">
    <div class="user_info e_card">
      <div class="title">
        用户信息
        <el-button
          size="mini"
          style="margin-left: 10px;"
          type="danger"
          icon="el-icon-error"
          @click="logOut"
        >退出</el-button>
      </div>
      <hr>
      <div class="row">
        <div class="col-md-6">
          <div class="content">
            <div class="key">用户名：</div>
            <div class="value">{{$store.state.name}}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="content">
            <div class="key">账号：</div>
            <div class="value">{{$store.state.account}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ranking">
      <div class="cost e_card">
        您的总消费额度为：
        <span>{{ranking.totalCost}}元</span>
        ，超过了{{ranking.costRanking}}%的人
      </div>
      <div class="way e_card">
        您最活跃的消费方式为：
        <span>{{ranking.mostWay | way}}</span>
        ，超过了{{ranking.wayRanking}}%的人，您是“{{ranking.mostWay | way}}达人”！
      </div>
    </div>
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
      repayment: Boolean(localStorage.getItem("repayment")),
      ranking: {
        totalCost: "",
        costRanking: "",
        mostWay: "",
        wayRanking: ""
      }
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
    },
    getUserRanking() {
      this.axios
        .get("/getUserRanking")
        .then(res => {
          if (res.data.code == 1) {
            this.ranking = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    logOut() {
      localStorage.clear();
      window.location.href = this.COMMON.login_location;
    }
  },
  mounted() {
    this.getSort();
    this.getUserRanking();
  }
};
</script>

<style lang='scss' scoped>
.user_info {
  .row {
    .content {
      display: flex;
      .key {
        color: #409eff;
        font-weight: bold;
      }
    }
  }
}

.ranking {
  margin-top: 20px;
  color: white;
  span {
    font-size: 1.5rem;
  }
  .cost {
    background-color: #67c23a;
  }
  .way {
    background-color: #67c23a;
  }
}

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