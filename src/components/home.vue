<template>
  <div id="home">
    <div class="status card">
      <div class="title">
        <span class="mdi mdi-calendar"></span>
        今日 | {{this.$moment().format('LL')}}
      </div>
      <hr>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="outer_content content">
            <div class="subtitle">总支出</div>
            <div class="money">￥{{todayOut | money}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="inner_contant content">
            <div class="subtitle">总收入</div>
            <div class="money">￥{{todayIn | money}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="progressbar card">
      <div class="title">本月已度过</div>
      <el-progress
        :text-inside="true"
        :stroke-width="18"
        :percentage="percentage"
        :status="status"
      ></el-progress>
    </div>
    <div class="list"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todayOut: 110,
      todayIn: 0,
      percentage: 10,
      status: "success"
    };
  },
  methods: {
    getTodayOut() {
      this.axios
        .get("/getOutByDay?time=" + Date.parse(new Date()))
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            let total = 0;
            for (let i in data) {
              total += Number(data[i].money);
            }
            this.todayOut = total;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接，无法获取今日支出");
        });
    },
    getTodayIn() {
      this.axios
        .get("/getInByDay?time=" + Date.parse(new Date()))
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            let total = 0;
            for (let i in data) {
              total += Number(data[i].money);
            }
            this.todayIn = total;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接，无法获取今日支出");
        });
    },
    getProgressbarData() {
      let last = this.$moment()
        .endOf("year")
        .format("DD");
      let now = this.$moment().format("DD");
      this.percentage = parseInt((now / last) * 100);
      if (this.percentage > 40 && this.percentage <= 70) {
        this.status = "text";
      } else if (this.percentage > 70) {
        this.status = "exception";
      }
    }
  },
  mounted() {
    this.getProgressbarData();
  }
};
</script>

<style lang='scss' scoped>
.status {
  .title {
    .mdi {
      font-size: 18px;
      position: relative;
      top: 2px;
    }
  }
  .el-progress {
    margin-top: 10px;
  }
  .el-row {
    color: white;
    .content {
      justify-content: space-between;
      padding: 20px;
      border-radius: 10px;
      .money {
        font-size: 2rem;
        text-align: right;
        @media screen and (max-width: 600px) {
          font-size: 1.5rem;
        }
      }
    }
    .outer_content {
      background-color: #409eff;
    }
    .inner_contant {
      background-color: #67c23a;
    }
  }
}

.progressbar {
  .title {
    font-size: 14px;
    margin-bottom: 10px;
  }
}
</style>