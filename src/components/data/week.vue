<template>
  <div id="week">
    <div class="top_box">
      <div class="row">
        <div class="col-md-4 col">
          <div class="info e_card">
            <div
              class="title"
            >{{$moment(time1).format("MM月Do")}} - {{$moment(time2).format("MM月Do")}}</div>
            <hr>
            <div class="content">
              <div class="data_box">
                <div class="out_total total">
                  <div class="subtitle">总支出</div>
                  <div class="data">{{totalOut | money}}元</div>
                </div>
                <div class="in_total total">
                  <div class="subtitle">总收入</div>
                  <div class="data">{{totalIn | money}}元</div>
                </div>
              </div>
              <div class="btn_box">
                <el-button type="primary" class="prev" @click="prev">上 周</el-button>
                <el-button type="primary" class="next" @click="next">下 周</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8 col">
          <div class="cahrt e_card">
            <ve-line :data="lineData"></ve-line>
          </div>
        </div>
      </div>
    </div>
    <div class="outList">
      <outList :time1="time1" :time2="time2"></outList>
    </div>
  </div>
</template>

<script>
import outList from "../subComponents/outList.vue";
// import outListVue from "../subComponents/outList.vue";
export default {
  data() {
    return {
      weekOutList: [],
      weekInList: [],
      time1: this.$moment()
        .startOf("week")
        .valueOf(),
      time2: this.$moment(Date.parse(new Date()))
        .endOf("week")
        .valueOf(),
      totalIn: "",
      totalOut: "",
      lineData: {}
    };
  },
  components: {
    outList
  },
  methods: {
    getWeekOutList(callback) {
      this.axios
        .get("/getOutList", {
          params: {
            time1: this.time1.toString(),
            time2: this.time2.toString()
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.weekOutList = res.data.data;
            this.calculateTotalOut();
            callback();
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    getWeekInList(callback) {
      this.axios
        .get("/getInList", {
          params: {
            time1: this.time1,
            time2: this.time2
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.weekInList = res.data.data;
            this.calculateTotalIn();
            callback();
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    calculateTotalOut() {
      let total = 0;
      for (let i in this.weekOutList) {
        for (let j in this.weekOutList[i]) {
          total += this.weekOutList[i][j].money;
        }
      }
      this.totalOut = total;
    },
    calculateTotalIn() {
      let total = 0;
      for (let i in this.weekInList) {
        for (let j in this.weekInList[i]) {
          total += this.weekInList[i][j].money;
        }
      }
      this.totalIn = total;
    },
    formatData() {
      let lineData = {
        columns: ["日期", "支出", "收入"],
        rows: [
          { 日期: "星期一", 支出: 0, 收入: 0 },
          { 日期: "星期二", 支出: 0, 收入: 0 },
          { 日期: "星期三", 支出: 0, 收入: 0 },
          { 日期: "星期四", 支出: 0, 收入: 0 },
          { 日期: "星期五", 支出: 0, 收入: 0 },
          { 日期: "星期六", 支出: 0, 收入: 0 },
          { 日期: "星期日", 支出: 0, 收入: 0 }
        ]
      };
      let outList = this.weekOutList;
      let inList = this.weekInList;
      // 支出
      for (let i in outList) {
        let money = 0;
        // 获取当天的消费总额
        for (let j in outList[i]) {
          money += outList[i][j].money;
        }
        // 填入数据表
        lineData.rows.some(current => {
          if (current.日期 == this.$moment(outList[i][0].time).format("dddd")) {
            current.支出 = money;
            return true;
          }
        });
      }

      // 收入
      for (let i in inList) {
        let money = 0;
        // 获取当天的收入总额
        for (let j in inList[i]) {
          money += inList[i][j].money;
        }
        // 填入数据表
        lineData.rows.some(current => {
          if (current.日期 == this.$moment(outList[i][0].time).format("dddd")) {
            current.收入 = money;
            return true;
          }
        });
      }
      this.lineData = lineData;
    },
    prev() {
      this.time2 = this.time1 - 1000;
      this.time1 = this.$moment(this.time2)
        .startOf("week")
        .valueOf();
    },
    next() {
      this.time1 = this.time2 + 1000;
      this.time2 = this.$moment(this.time1)
        .endOf("week")
        .valueOf();
    }
  },
  mounted() {
    this.getWeekOutList(() => {
      this.getWeekInList(() => {
        this.formatData();
      });
    });
  },
  watch: {
    time1: function() {
      this.getWeekOutList(() => {
        this.getWeekInList(() => {
          this.formatData();
        });
      });
    },
    time2: function() {
      this.getWeekOutList(() => {
        this.getWeekInList(() => {
          this.formatData();
        });
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.top_box {
  .col {
    padding-bottom: 20px;
    .info {
      height: 100%;
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .data_box {
          display: flex;
          justify-content: space-between;
          .total {
            height: 150px;
            width: 150px;
            border-radius: 100px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .out_total {
            color: white;
            text-align: center;
            background-color: #409eff;
            margin-right: 20px;
          }
          .in_total {
            color: white;
            text-align: center;
            background-color: #67c23a;
          }
        }
        .btn_box {
          display: flex;
          justify-content: space-between;
          padding: 0 50px;
          margin-top: 40px;
        }
      }
    }
    .cahrt {
      height: 100%;
      padding-bottom: 0px;
    }
  }
}
</style>