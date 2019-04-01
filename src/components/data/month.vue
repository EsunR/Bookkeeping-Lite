<template>
  <div id="month">
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
                <el-button type="primary" class="prev" @click="prev">前一月</el-button>
                <el-button type="primary" class="next" @click="next">后一月</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-8 col">
          <div class="chart e_card">
            <ve-line :data="lineData" :settings="{area: true}"></ve-line>
          </div>
        </div>
      </div>
    </div>
    <div class="pie_box e_card">
      <div class="row">
        <div class="col-md-6">
          <ve-pie v-if="haveSortData == true" :data="sortPieData"></ve-pie>
          <div v-if="haveSortData == false" class="subtitle">（暂无记录）</div>
          <div class="title">消费类型分析</div>
        </div>
        <div class="col-md-6">
          <ve-pie v-if="haveWayData == true" :data="wayPieData"></ve-pie>
          <div v-if="haveWayData == false" class="subtitle">（暂无记录）</div>
          <div class="title">消费方式分析</div>
        </div>
      </div>
    </div>

    <div class="mode_box e_card">
      <div
        class="mode_outList tab"
        :class="{active: mode=='outList'}"
        @click="mode = 'outList'"
      >查看支出</div>
      <div class="mode_inList tab" :class="{active: mode=='inList'}" @click="mode = 'inList'">查看收入</div>
    </div>
    <outList v-if="mode == 'outList'" :time1="time1" :time2="time2"></outList>
    <inList v-if="mode == 'inList'" :time1="time1" :time2="time2"></inList>
  </div>
</template>

<script>
import outList from "../subComponents/outList.vue";
import inList from "../subComponents/inList.vue";
export default {
  data() {
    return {
      monthOutList: [],
      monthInList: [],
      time1: this.$moment()
        .startOf("month")
        .valueOf(),
      time2: this.$moment(Date.parse(new Date()))
        .endOf("month")
        .valueOf(),
      totalIn: "",
      totalOut: "",
      lineData: {},
      sortPieData: {},
      wayPieData: {},
      mode: "outList",
      haveSortData: false,
      haveWayData: false
    };
  },
  components: {
    outList,
    inList
  },
  methods: {
    getMonthOutList(callback) {
      this.axios
        .get("/getOutList", {
          params: {
            time1: this.time1.toString(),
            time2: this.time2.toString()
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.monthOutList = res.data.data;
            this.calculateTotalOut();
            callback();
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    getMonthInList(callback) {
      this.axios
        .get("/getInList", {
          params: {
            time1: this.time1,
            time2: this.time2
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.monthInList = res.data.data;
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
      for (let i in this.monthOutList) {
        for (let j in this.monthOutList[i]) {
          total += this.monthOutList[i][j].money;
        }
      }
      this.totalOut = total;
    },
    calculateTotalIn() {
      let total = 0;
      for (let i in this.monthInList) {
        for (let j in this.monthInList[i]) {
          total += this.monthInList[i][j].money;
        }
      }
      this.totalIn = total;
    },
    formatLineData() {
      let lineData = {
        columns: ["日期", "收入", "支出"],
        rows: []
      };
      let day = this.$moment(this.time2).format("D");
      for (let i = 0; i < day; i++) {
        let obj = { 日期: (i+1).toString(), 收入: 0, 支出: 0 };
        lineData.rows.push(obj);
      }
      let outList = this.monthOutList;
      let inList = this.monthInList;
      // 支出
      for (let i in outList) {
        let money = 0;
        // 获取当天的消费总额
        for (let j in outList[i]) {
          money += outList[i][j].money;
        }
        // 填入数据表
        lineData.rows.some(current => {
          if (current.日期 == this.$moment(outList[i][0].time).format("D")) {
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
    formatSortPieData() {
      let outList = this.monthOutList;
      let sortPieData = {
        columns: ["消费类型", "金额"],
        rows: []
      };
      outList.forEach(item => {
        item.forEach(subItem => {
          let sort = subItem.sort;
          let money = subItem.money;
          let index = sortPieData.length;
          sortPieData.rows.some((rowsItem, rowsIndex) => {
            if (rowsItem.消费类型 == sort) {
              index = rowsIndex;
              return true;
            }
          });
          if (index == sortPieData.length) {
            sortPieData.rows.push({ 消费类型: sort, 金额: money });
          } else {
            sortPieData.rows[index].金额 += money;
          }
        });
      });
      sortPieData.rows.length != 0
        ? (this.haveSortData = true)
        : (this.haveSortData = false);
      this.sortPieData = sortPieData;
    },
    formatWayPieData() {
      let outList = this.monthOutList;
      let wayPieData = {
        columns: ["消费方式", "金额"],
        rows: []
      };
      outList.forEach(item => {
        item.forEach(subItem => {
          let way = subItem.way;
          let money = subItem.money;
          let index = wayPieData.length;
          let wayId = way.toString();
          switch (wayId) {
            case "1":
              way = "现金";
              break;
            case "2":
              way = "支付宝";
              break;
            case "3":
              way = "微信";
              break;
            case "4":
              way = "其他";
              break;
          }
          wayPieData.rows.some((rowsItem, rowsIndex) => {
            if (rowsItem.消费方式 == way) {
              index = rowsIndex;
              return true;
            }
          });
          if (index == wayPieData.length) {
            wayPieData.rows.push({ 消费方式: way, 金额: money });
          } else {
            wayPieData.rows[index].金额 += money;
          }
        });
      });
      wayPieData.rows.length != 0
        ? (this.haveWayData = true)
        : (this.haveWayData = false);
      this.wayPieData = wayPieData;
    },
    formatData() {
      this.formatLineData();
      this.formatSortPieData();
      this.formatWayPieData();
    },
    prev() {
      this.time2 = this.time1 - 1000;
      this.time1 = this.$moment(this.time2)
        .startOf("month")
        .valueOf();
    },
    next() {
      this.time1 = this.time2 + 1000;
      this.time2 = this.$moment(this.time1)
        .endOf("month")
        .valueOf();
    }
  },
  mounted() {
    this.getMonthOutList(() => {
      this.getMonthInList(() => {
        this.formatData();
      });
    });
  },
  watch: {
    time1: function() {
      this.getMonthOutList(() => {
        this.getMonthInList(() => {
          this.formatData();
        });
      });
    },
    time2: function() {
      this.getMonthOutList(() => {
        this.getMonthInList(() => {
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
          padding: 0 30px;
          margin-top: 40px;
        }
      }
    }
    .chart {
      height: 100%;
      padding-bottom: 0px;
    }
  }
}
.pie_box {
  padding-bottom: 0;
  .subtitle {
    margin-bottom: 60px;
    margin-top: 30px;
    text-align: center;
  }
  .title {
    text-align: center;
    margin-top: -30px;
    font-size: 18px;
    background-color: rgba(0, 0, 0, 0.1);
    color: #606266;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 20px;
  }
}

.mode_box {
  display: flex;
  justify-content: space-between;
  padding: 0;
  overflow: hidden;
  .tab {
    width: 50%;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }
  .active {
    background-color: #409eff;
    color: white;
  }
}
</style>