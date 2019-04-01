<template>
  <div id="compared">
    <div class="e_card time_picker">
      <div class="title">选择对比时间</div>
      <hr>
      <div class="row">
        <div class="col-md-6">
          <el-date-picker v-model="month_1" type="month" placeholder="选择月" value-format="timestamp"></el-date-picker>
        </div>
        <div class="col-md-6">
          <el-date-picker v-model="month_2" type="month" placeholder="选择月" value-format="timestamp"></el-date-picker>
        </div>
      </div>
      <div class="btn_box">
        <el-button type="primary" style="margin-top: 20px;" @click="submit">确认</el-button>
      </div>
    </div>

    <div v-show="flag" class="compared_box e_card">
      <div class="title">支出对比</div>
      <hr>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="outer_content content">
            <div class="subtitle">
              <span class="mdi mdi-calendar"></span>
              <span>{{this.$moment(month_1).format('YYYY年M月')}}</span>
            </div>
            <div class="money">￥{{totalOut_1 | money}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="outer_content content">
            <div class="subtitle">
              <span class="mdi mdi-calendar"></span>
              <span>{{this.$moment(month_1).format('YYYY年M月')}}</span>
            </div>
            <div class="money">￥{{totalOut_2 | money}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div v-show="flag" class="compared_box compared_in e_card">
      <div class="title">收入对比</div>
      <hr>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="inner_contant content">
            <div class="subtitle">
              <span class="mdi mdi-calendar"></span>
              <span>{{this.$moment(month_1).format('YYYY年M月')}}</span>
            </div>
            <div class="money">￥{{totalIn_1 | money}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="inner_contant content">
            <div class="subtitle">
              <span class="mdi mdi-calendar"></span>
              <span>{{this.$moment(month_1).format('YYYY年M月')}}</span>
            </div>
            <div class="money">￥{{totalIn_2 | money}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      month_1: "",
      month_2: "",
      outList_1: [],
      outList_2: [],
      inList_1: [],
      inList_2: [],
      totalOut_1: "",
      totalOut_2: "",
      totalIn_1: "",
      totalIn_2: "",
      flag: false
    };
  },
  methods: {
    submit() {
      if (
        this.month_1 == "" ||
        this.month_2 == "" ||
        this.month_1 == this.month_2
      ) {
        this.$message.error("请规范日期");
      } else {
        this.getOutList(
          this.month_1,
          this.$moment(this.month_1)
            .endOf("month")
            .valueOf(),
          1
        );
        this.getOutList(
          this.month_2,
          this.$moment(this.month_2)
            .endOf("month")
            .valueOf(),
          2
        );
        this.getInList(
          this.month_1,
          this.$moment(this.month_1)
            .endOf("month")
            .valueOf(),
          1
        );
        this.getInList(
          this.month_2,
          this.$moment(this.month_2)
            .endOf("month")
            .valueOf(),
          2
        );
        this.flag = true;
      }
    },
    getOutList(time1, time2, option) {
      this.axios
        .get("/getOutList", {
          params: {
            time1,
            time2
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            switch (option) {
              case 1:
                this.outList_1 = res.data.data;
                this.calculateTotalOut(1);
                break;
              case 2:
                this.outList_2 = res.data.data;
                this.calculateTotalOut(2);
                break;
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    getInList(time1, time2, option) {
      this.axios
        .get("/getInList", {
          params: {
            time1,
            time2
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            switch (option) {
              case 1:
                this.inList_1 = res.data.data;
                this.calculateTotalIn(1);
                break;
              case 2:
                this.inList_2 = res.data.data;
                this.calculateTotalIn(2);
                break;
            }
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    calculateTotalOut(option) {
      let total_1 = 0;
      let total_2 = 0;
      switch (option) {
        case 1:
          for (let i in this.outList_1) {
            for (let j in this.outList_1[i]) {
              total_1 += this.outList_1[i][j].money;
            }
          }
          this.totalOut_1 = total_1;
          break;
        case 2:
          for (let i in this.outList_2) {
            for (let j in this.outList_2[i]) {
              total_2 += this.outList_2[i][j].money;
            }
          }
          this.totalOut_2 = total_2;
          break;
      }
    },
    calculateTotalIn(option) {
      let total_1 = 0;
      let total_2 = 0;
      switch (option) {
        case 1:
          total_1 = 0;
          for (let i in this.inList_1) {
            for (let j in this.inList_1[i]) {
              total_1 += this.inList_1[i][j].money;
            }
          }
          this.totalIn_1 = total_1;
          break;
        case 2:
          for (let i in this.inList_2) {
            for (let j in this.inList_2[i]) {
              total_2 += this.inList_2[i][j].money;
            }
          }
          this.totalIn_2 = total_2;
          break;
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

.compared_box {
  position: relative;
  padding-bottom: 40px;
  margin-bottom: 40px;
  .el-row {
    color: white;
    .subtitle {
      span {
        margin-right: 5px;
      }
    }
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
}
</style>