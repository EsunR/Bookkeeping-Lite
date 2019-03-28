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
          <div class="outer_content content" @click="$router.push('/home/expenditure')">
            <div class="subtitle">支出</div>
            <div class="money">￥{{todayOut | money}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="inner_contant content" @click="$router.push('/home/income')">
            <div class="subtitle">收入</div>
            <div class="money">￥{{todayIn | money}}</div>
          </div>
        </el-col>
      </el-row>
      <div class="add_btn shadow_base" @click="$router.push('/add')">
        <span class="mdi mdi-plus"></span>
      </div>
    </div>
    <div class="progressbar card">
      <div class="title">本月已度过</div>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" :status="status"></el-progress>
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
      todayOut: 110,
      todayIn: 0,
      percentage: 0,
      status: "success"
    };
  },
  methods: {
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
    },
    getTodyOut() {
      this.axios
        .post("/getOutList", {
          params: {
            time1: this.$moment().startOf("day").valueOf().toString(),
            time2: Date.parse(new Date()).toString()
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            console.log(res.data.data);
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    }
  },
  mounted() {
    this.getProgressbarData();
    // this.getTodyOut();
  }
};
</script>

<style lang='scss' scoped>
#home {
  position: relative;
}

.status {
  position: relative;
  padding-bottom: 40px;
  margin-bottom: 40px;
  .title {
    .mdi {
      font-size: 18px;
      position: relative;
      top: 2px;
    }
  }
  .el-row {
    color: white;
    .content {
      cursor: pointer;
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
  .add_btn {
    position: absolute;
    bottom: -25px;
    right: 20px;
    line-height: 50px;
    width: 50px;
    background-color: #409eff;
    text-align: center;
    color: white;
    font-size: 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    &:hover {
      background-color: #53a8ff;
    }
  }
}

.progressbar {
  .title {
    font-size: 14px;
    margin-bottom: 10px;
  }
}

.list {
  .day {
    .title {
      font-size: 14px;
      color: #909399;
    }
    hr {
      margin-bottom: 0;
    }

    .dayList {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 20px;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
      @media screen and (max-width: 575px) {
        padding: 20px 0 !important;
      }
      .left {
        display: flex;
        align-items: center;
        .icon {
          font-size: 1.2rem;
          margin-right: 10px;
          .mdi {
            display: block;
            line-height: 45px;
            width: 45px;
            text-align: center;
            color: white;
            border-radius: 40px;
          }
          .mdi-cash-multiple {
            background-color: #ff9800;
            &::before {
              top: -2px;
            }
          }
          .mdi-wallet {
            background-color: #409eff;
          }
          .mdi-wechat {
            background-color: #67c23a;
          }
          .mdi-dots-horizontal {
            background-color: #909399;
          }
          .mdi::before {
            position: relative;
            left: 1px;
          }
        }
        .text_box {
          .way {
            font-size: 14px;
            color: #909399;
          }
        }
      }
      .right {
        text-align: right;
        .time {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}
</style>