<template>
  <div id="customize">
    <div class="status card">
      <div class="title">
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-button class="submit_btn" type="primary" @click="submit">提交</el-button>
      </div>
      <hr>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="outer_content content" @click="$router.push('/home/expenditure')">
            <div class="subtitle">支出</div>
            <div class="money">￥{{totalOut | money}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="inner_contant content" @click="$router.push('/home/income')">
            <div class="subtitle">收入</div>
            <div class="money">￥{{totalIn | money}}</div>
          </div>
        </el-col>
      </el-row>
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
      lineData: {},
      sortPieData: {},
      wayPieData: {},
      mode: "outList",
      haveSortData: false,
      haveWayData: false,
      time: ""
    };
  },
  components: {
    outList,
    inList
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
    formatLineData() {
      let lineData = {
        columns: ["日期", "收入", "支出"],
        rows: [
          { 日期: "星期一", 收入: 0, 支出: 0 },
          { 日期: "星期二", 收入: 0, 支出: 0 },
          { 日期: "星期三", 收入: 0, 支出: 0 },
          { 日期: "星期四", 收入: 0, 支出: 0 },
          { 日期: "星期五", 收入: 0, 支出: 0 },
          { 日期: "星期六", 收入: 0, 支出: 0 },
          { 日期: "星期日", 收入: 0, 支出: 0 }
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
    formatSortPieData() {
      let outList = this.weekOutList;
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
      let outList = this.weekOutList;
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
        .startOf("week")
        .valueOf();
    },
    next() {
      this.time1 = this.time2 + 1000;
      this.time2 = this.$moment(this.time1)
        .endOf("week")
        .valueOf();
    },
    submit() {
      this.time1 = this.$moment(this.time[0]).valueOf();
      this.time2 = this.$moment(this.time[1]).valueOf();
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
.status {
  position: relative;
  padding-bottom: 40px;
  margin-bottom: 40px;
  .title {
    display: flex;
    justify-content: space-between;
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